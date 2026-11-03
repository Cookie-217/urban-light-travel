package com.urbantravel.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.urbantravel.model.dto.PoiDto;
import com.urbantravel.model.dto.PlanDto;
import com.urbantravel.model.dto.PlanDto.RoutePlan;
import com.urbantravel.model.dto.PlanDto.RouteStep;
import com.urbantravel.model.entity.Poi;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * 城市轻出行路线推荐引擎
 * 综合考虑：POI 评分、兴趣匹配、出行方式（速度/费用）、时间预算、预算上限、实时天气。
 * 采用「贪心最近优先 + 质量加权」策略生成有序行程。
 */
@Service
public class RecommendationService {

    private final PoiService poiService;
    private final WeatherService weatherService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public RecommendationService(PoiService poiService, WeatherService weatherService) {
        this.poiService = poiService;
        this.weatherService = weatherService;
    }

    // 出行方式参数：速度(km/h)、每公里费用、每段基础费用
    private static final Map<String, double[]> TRANSPORT = new HashMap<>();
    static {
        TRANSPORT.put("walk",  new double[]{4.5, 0.0, 0.0});
        TRANSPORT.put("bike",  new double[]{15.0, 1.2, 0.0});
        TRANSPORT.put("bus",   new double[]{20.0, 0.0, 2.0});
        TRANSPORT.put("metro", new double[]{35.0, 0.25, 2.0});
        TRANSPORT.put("taxi",  new double[]{30.0, 2.4, 10.0});
        TRANSPORT.put("mixed", new double[]{28.0, 0.5, 3.0});
    }

    private static final Set<String> OUTDOOR_CATEGORIES =
            new HashSet<>(Arrays.asList("park", "nature", "night", "culture"));

    public RoutePlan plan(PlanDto.PlanRequest req) {
        String mode = req.transportMode == null ? "walk" : req.transportMode;
        if (!TRANSPORT.containsKey(mode)) mode = "walk";
        double[] tp = TRANSPORT.get(mode);
        double speed = tp[0];
        double costPerKm = tp[1];
        double baseCost = tp[2];

        double budgetHours = req.timeBudgetHours > 0 ? req.timeBudgetHours : 4.0;
        double remainingMin = budgetHours * 60.0;
        double remainingBudget = req.maxBudget != null ? req.maxBudget : Double.MAX_VALUE;

        // 候选 POI
        List<Poi> candidates = poiService.search(req.city, null).stream()
                .map(d -> toPoi(d))
                .collect(ArrayList::new, ArrayList::add, ArrayList::addAll);
        if (req.interests != null && !req.interests.isEmpty()) {
            Set<String> interestSet = new HashSet<>(req.interests);
            candidates.removeIf(p -> p.getCategory() == null || !interestSet.contains(p.getCategory()));
        }

        WeatherService.WeatherInfo weather = null;
        if (req.useWeather) {
            weather = weatherService.getWeather(req.originLat, req.originLng);
        }

        double curLat = req.originLat;
        double curLng = req.originLng;
        List<RouteStep> steps = new ArrayList<>();
        List<List<Double>> polyline = new ArrayList<>();
        polyline.add(Arrays.asList(req.originLng, req.originLat));

        double totalDist = 0, totalCost = 0;
        int totalDur = 0;

        Set<Long> visited = new HashSet<>();
        while (remainingMin > 40 && !candidates.isEmpty()) {
            Poi best = null;
            double bestScore = -1;
            double bestDistKm = 0;
            double bestTravelMin = 0;
            double bestCost = 0;

            for (Poi p : candidates) {
                if (visited.contains(p.getId())) continue;
                double distKm = haversine(curLat, curLng, p.getLat(), p.getLng());
                double travelMin = (distKm / speed) * 60.0;
                // 预留往返/继续移动缓冲：单段移动不超过剩余时间的 55%
                if (travelMin > remainingMin * 0.55) continue;
                if (distKm * costPerKm + baseCost > remainingBudget) continue;

                double score = qualityScore(p, req.interests, weather)
                        - (travelMin / 60.0) * 0.6;   // 长途出行惩罚
                if (score > bestScore) {
                    bestScore = score;
                    best = p;
                    bestDistKm = distKm;
                    bestTravelMin = travelMin;
                    bestCost = distKm * costPerKm + baseCost;
                }
            }

            if (best == null) break;

            int visitMin = Math.max(20, best.getAvgDurationMin());
            int stepDur = (int) Math.round(bestTravelMin) + visitMin;
            if (stepDur > remainingMin) break;

            steps.add(new RouteStep(PoiDto.from(best), round2(bestDistKm),
                    stepDur, mode, round2(bestCost)));
            polyline.add(Arrays.asList(best.getLng(), best.getLat()));
            totalDist += bestDistKm;
            totalCost += bestCost;
            totalDur += stepDur;
            remainingMin -= stepDur;
            remainingBudget -= bestCost;
            curLat = best.getLat();
            curLng = best.getLng();
            visited.add(best.getId());
        }

        RoutePlan plan = new RoutePlan();
        plan.steps = steps;
        plan.totalDistanceKm = round2(totalDist);
        plan.totalDurationMin = totalDur;
        plan.totalCost = round2(totalCost);
        plan.polyline = polyline;
        plan.usedAi = false;
        plan.weatherNote = weather == null ? null
                : ("实时天气：" + weather.description + "，气温 " + Math.round(weather.temperature) + "℃。"
                   + (weather.isBadForOutdoor ? " 户外景点可能受影响，已优先安排室内/备选。" : " 天气宜人，适合轻出行。"));
        plan.summary = buildSummary(steps, mode, plan);
        return plan;
    }

    private double qualityScore(Poi p, List<String> interests, WeatherService.WeatherInfo weather) {
        double rating = p.getRating() / 5.0;                       // 0-1
        double interestMatch = (interests != null && p.getCategory() != null
                && interests.contains(p.getCategory())) ? 1.0 : 0.4;
        double affordability = (4.0 - (p.getPriceLevel() - 1)) / 4.0; // 越便宜越好
        double score = rating * 0.4 + interestMatch * 0.35 + affordability * 0.25;
        if (weather != null && weather.isBadForOutdoor
                && p.getCategory() != null && OUTDOOR_CATEGORIES.contains(p.getCategory())) {
            score -= 0.8;
        }
        return score;
    }

    private String buildSummary(List<RouteStep> steps, String mode, RoutePlan plan) {
        if (steps.isEmpty()) {
            return "当前条件下未找到合适的轻出行目的地，试试放宽时间预算或更换出行方式。";
        }
        String modeName = modeName(mode);
        StringBuilder sb = new StringBuilder();
        sb.append(String.format("为你规划了一条以「%s」为主的轻出行路线，共 %d 个站点，",
                modeName, steps.size()));
        sb.append(String.format("预计总距离 %.1f km、耗时约 %d 分钟、花费约 ¥%.0f。",
                plan.totalDistanceKm, plan.totalDurationMin, plan.totalCost));
        sb.append("沿途推荐：");
        for (int i = 0; i < steps.size(); i++) {
            sb.append(steps.get(i).poi.name);
            if (i < steps.size() - 1) sb.append(" → ");
        }
        return sb.toString();
    }

    public static String modeName(String mode) {
        switch (mode) {
            case "walk": return "步行";
            case "bike": return "骑行";
            case "bus": return "公交";
            case "metro": return "地铁";
            case "taxi": return "打车";
            case "mixed": return "公共交通接驳";
            default: return "步行";
        }
    }

    public static String categoryName(String cat) {
        switch (cat) {
            case "park": return "公园绿地";
            case "food": return "美食";
            case "culture": return "文化古迹";
            case "shopping": return "购物";
            case "nature": return "自然风光";
            case "night": return "夜生活";
            case "transit": return "交通枢纽";
            default: return cat;
        }
    }

    // ---- 工具方法 ----
    private Poi toPoi(PoiDto d) {
        Poi p = new Poi();
        p.setId(d.id); p.setName(d.name); p.setCategory(d.category);
        p.setLng(d.lng); p.setLat(d.lat); p.setAddress(d.address);
        p.setRating(d.rating); p.setPriceLevel(d.priceLevel); p.setTags(d.tags);
        p.setAvgDurationMin(d.avgDurationMin); p.setCity(d.city);
        p.setOpenHours(d.openHours); p.setDescription(d.description);
        return p;
    }

    public static double haversine(double lat1, double lng1, double lat2, double lng2) {
        final int R = 6371;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLng = Math.toRadians(lng2 - lng1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLng / 2) * Math.sin(dLng / 2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    private static double round2(double v) { return Math.round(v * 100.0) / 100.0; }
}
