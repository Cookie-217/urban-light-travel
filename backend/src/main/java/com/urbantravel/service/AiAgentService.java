package com.urbantravel.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.urbantravel.model.dto.PlanDto;
import com.urbantravel.model.dto.AiDto.ChatRequest;
import com.urbantravel.model.dto.AiDto.ChatResponse;
import com.urbantravel.model.dto.AiDto.ChatTurn;
import com.urbantravel.model.dto.PlanDto.PlanRequest;
import com.urbantravel.model.dto.PlanDto.RoutePlan;
import com.urbantravel.model.dto.PlanDto.RouteStep;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 轻出行 AI 智能体
 * - 若配置了大模型（OpenAI 兼容接口），则调用大模型生成自然对话与行程解说；
 * - 否则启用内置规则兜底 Agent，保证离线可用。
 * - 能识别用户「规划/推荐行程」意图，自动调用路线推荐引擎并组织回复。
 */
@Service
public class AiAgentService {

    private final RecommendationService recommendationService;
    private final CityCenters cityCenters;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private final boolean enabled;
    private final String apiBase;
    private final String apiKey;
    private final String model;
    private final double temperature;
    private final int timeoutMs;

    public AiAgentService(RecommendationService recommendationService,
                          CityCenters cityCenters,
                          @Value("${ai.enabled:false}") boolean enabled,
                          @Value("${ai.api-base}") String apiBase,
                          @Value("${ai.api-key}") String apiKey,
                          @Value("${ai.model}") String model,
                          @Value("${ai.temperature:0.7}") double temperature,
                          @Value("${ai.timeout-ms:20000}") int timeoutMs) {
        this.recommendationService = recommendationService;
        this.cityCenters = cityCenters;
        this.enabled = enabled;
        this.apiBase = apiBase;
        this.apiKey = apiKey;
        this.model = model;
        this.temperature = temperature;
        this.timeoutMs = timeoutMs;
    }

    public boolean isLlmEnabled() {
        return enabled && apiKey != null && !apiKey.trim().isEmpty();
    }

    public ChatResponse chat(ChatRequest req) {
        String message = req == null || req.message == null ? "" : req.message.trim();
        if (message.isEmpty()) {
            return new ChatResponse("你好呀～告诉我你想去哪座城市、玩多久、喜欢什么，我来帮你规划轻出行路线 🚲", false, null);
        }

        boolean wantsPlan = isPlanIntent(message);
        if (wantsPlan) {
            PlanDto.PlanRequest planReq = parsePlanRequest(message);
            try {
                RoutePlan plan = recommendationService.plan(planReq);
                String narrative = narratePlan(plan, message);
                return new ChatResponse(narrative, isLlmEnabled(), plan);
            } catch (Exception e) {
                return new ChatResponse(fallbackReply(message), false, null);
            }
        }

        // 纯对话
        if (isLlmEnabled()) {
            try {
                String reply = callLlm(buildMessages(req));
                return new ChatResponse(reply, true, null);
            } catch (Exception e) {
                return new ChatResponse(fallbackReply(message), false, null);
            }
        }
        return new ChatResponse(fallbackReply(message), false, null);
    }

    // ---- 意图识别与参数解析 ----
    private boolean isPlanIntent(String msg) {
        String[] keys = {"规划", "推荐", "路线", "行程", "去玩", "去哪", "一日游", "游玩", "攻略", "怎么玩", "怎么走", "溜达"};
        for (String k : keys) if (msg.contains(k)) return true;
        // 含城市名 + 时间/天数 也视为规划
        if (cityCenters.contains(firstCity(msg)) && (msg.contains("小时") || msg.contains("天") || msg.contains("半天")))
            return true;
        return false;
    }

    public PlanDto.PlanRequest parsePlanRequest(String msg) {
        PlanDto.PlanRequest r = new PlanDto.PlanRequest();
        r.transportMode = "mixed";
        r.timeBudgetHours = 4.0;
        r.useWeather = true;

        String city = firstCity(msg);
        r.city = city;

        double[] center = cityCenters.get(city);
        r.originLat = center[0];
        r.originLng = center[1];

        // 时间预算
        Matcher m = Pattern.compile("(\\d+)\\s*小时").matcher(msg);
        if (m.find()) r.timeBudgetHours = Double.parseDouble(m.group(1));
        else {
            Matcher d = Pattern.compile("(\\d+)\\s*天").matcher(msg);
            if (d.find()) r.timeBudgetHours = Double.parseDouble(d.group(1)) * 8.0;
            else if (msg.contains("半天")) r.timeBudgetHours = 4.0;
            else if (msg.contains("一天") || msg.contains("一整天")) r.timeBudgetHours = 8.0;
        }

        // 兴趣
        List<String> interests = new ArrayList<>();
        if (msg.contains("美食") || msg.contains("吃") || msg.contains("小吃") || msg.contains("餐厅")) interests.add("food");
        if (msg.contains("公园") || msg.contains("绿地") || msg.contains("草坪") || msg.contains("露营")) interests.add("park");
        if (msg.contains("文化") || msg.contains("古迹") || msg.contains("博物馆") || msg.contains("历史") || msg.contains("寺庙") || msg.contains("古镇")) interests.add("culture");
        if (msg.contains("购物") || msg.contains("商场") || msg.contains("逛街") || msg.contains("买")) interests.add("shopping");
        if (msg.contains("自然") || msg.contains("山水") || msg.contains("湖") || msg.contains("山") || msg.contains("风景")) interests.add("nature");
        if (msg.contains("夜") || msg.contains("酒吧") || msg.contains("夜景") || msg.contains("夜生活")) interests.add("night");
        if (interests.isEmpty()) interests = new ArrayList<>(Arrays.asList("park", "food", "culture", "nature"));
        r.interests = interests;

        // 出行方式
        if (msg.contains("步行") || msg.contains("走路") || msg.contains("漫步")) r.transportMode = "walk";
        else if (msg.contains("骑") || msg.contains("单车") || msg.contains("自行车") || msg.contains("单车")) r.transportMode = "bike";
        else if (msg.contains("地铁")) r.transportMode = "metro";
        else if (msg.contains("公交") || msg.contains("巴士")) r.transportMode = "bus";
        else if (msg.contains("打车") || msg.contains("出租") || msg.contains("网约车")) r.transportMode = "taxi";
        else if (msg.contains("自驾")) r.transportMode = "taxi";

        return r;
    }

    private String firstCity(String msg) {
        for (String c : cityCenters.cityNames()) {
            if (msg.contains(c)) return c;
        }
        return null;
    }

    // ---- 行程解说 ----
    private String narratePlan(RoutePlan plan, String userMsg) {
        if (!isLlmEnabled()) {
            StringBuilder sb = new StringBuilder();
            sb.append("🌟 已根据你的需求生成轻出行方案：\n\n");
            sb.append(plan.summary).append("\n");
            if (plan.weatherNote != null) sb.append("\n🌤 ").append(plan.weatherNote).append("\n");
            sb.append("\n行程明细：\n");
            for (int i = 0; i < plan.steps.size(); i++) {
                RouteStep s = plan.steps.get(i);
                sb.append(String.format("%d. %s（%s，约 %d 分钟，¥%.0f）\n",
                        i + 1, s.poi.name, RecommendationService.categoryName(s.poi.category),
                        s.durationMin, s.cost));
            }
            sb.append("\n💡 在「路线规划」页面可查看地图与更精细的调整。");
            return sb.toString();
        }
        try {
            List<Map<String, String>> messages = new ArrayList<>();
            messages.add(map("system",
                    "你是城市轻出行智能助手，语气亲切专业。下面是由路线推荐引擎生成的行程方案（JSON，已存在、请勿编造景点）。"
                            + "请用简练生动的中文写一段推荐语，并逐站介绍，最后给出 1-2 条实用贴士。不要使用 Markdown 代码块。"));
            messages.add(map("user",
                    "用户需求：" + userMsg + "\n\n行程方案数据：\n" + objectMapper.writeValueAsString(plan)));
            return callLlm(messages);
        } catch (Exception e) {
            return plan.summary;
        }
    }

    // ---- 规则兜底对话 ----
    private String fallbackReply(String msg) {
        if (msg.contains("你好") || msg.contains("您好") || msg.contains("hi") || msg.contains("hello"))
            return "你好！我是城市轻出行 AI 助手 🚲。试着对我说：「帮我规划杭州一天的行程，喜欢美食和公园」，或「成都半天怎么玩」～";
        if (msg.contains("你是") || msg.contains("介绍") || msg.contains("能做什么"))
            return "我是基于 Java 的城市轻出行路线推荐系统的 AI 智能体。我能：\n"
                    + "1️⃣ 根据你的城市、时间、兴趣生成轻出行路线；\n"
                    + "2️⃣ 结合实时天气调整户外安排；\n"
                    + "3️⃣ 估算距离、耗时与花费。\n"
                    + "（当前为离线规则模式，配置大模型 API 后可获得更自然的对话。）";
        if (msg.contains("天气"))
            return "我会在规划路线时自动获取起点实时天气，雨天会优先推荐室内/文化类景点。试试「北京一天游，怕下雨」。";
        if (msg.contains("谢谢") || msg.contains("感谢"))
            return "不客气，祝你出行愉快！🚲 有需要随时叫我。";
        return "收到～如果你想规划路线，告诉我「城市 + 时长 + 兴趣」即可，例如：「上海半日游，喜欢购物和美食」。"
                + "也可以到「路线规划」页面在地图上自己选起点。";
    }

    // ---- 大模型调用（OpenAI 兼容） ----
    private String callLlm(List<Map<String, String>> messages) {
        String url = apiBase.endsWith("/") ? apiBase + "chat/completions" : apiBase + "/chat/completions";
        Map<String, Object> body = new HashMap<>();
        body.put("model", model);
        body.put("temperature", temperature);
        body.put("messages", messages);

        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.set("Authorization", "Bearer " + apiKey);
        headers.set("Content-Type", "application/json");
        org.springframework.http.HttpEntity<String> entity =
                new org.springframework.http.HttpEntity<>(toJson(body), headers);

        RestTemplate rt = new RestTemplate();
        rt.setRequestFactory(new org.springframework.http.client.SimpleClientHttpRequestFactory());
        ((org.springframework.http.client.SimpleClientHttpRequestFactory) rt.getRequestFactory())
                .setConnectTimeout(timeoutMs);
        ((org.springframework.http.client.SimpleClientHttpRequestFactory) rt.getRequestFactory())
                .setReadTimeout(timeoutMs);

        Map<String, Object> resp = rt.postForObject(url, entity, Map.class);
        if (resp == null) return null;
        Object choices = resp.get("choices");
        if (choices instanceof List && !((List<?>) choices).isEmpty()) {
            Object first = ((List<?>) choices).get(0);
            if (first instanceof Map) {
                Object message = ((Map<?, ?>) first).get("message");
                if (message instanceof Map) {
                    Object content = ((Map<?, ?>) message).get("content");
                    return content == null ? null : content.toString().trim();
                }
            }
        }
        return null;
    }

    private List<Map<String, String>> buildMessages(ChatRequest req) {
        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(map("system",
                "你是城市轻出行 AI 助手，专注于城市轻出行（步行/骑行/公共交通）的景点推荐、交通与花费建议。"
                        + "用简练友好的中文回答，避免编造具体数据。"));
        if (req.history != null) {
            for (ChatTurn t : req.history) {
                if (t.role != null && t.content != null) messages.add(map(t.role, t.content));
            }
        }
        messages.add(map("user", req.message));
        return messages;
    }

    private Map<String, String> map(String role, String content) {
        Map<String, String> m = new HashMap<>();
        m.put("role", role);
        m.put("content", content);
        return m;
    }

    private String toJson(Object o) {
        try { return objectMapper.writeValueAsString(o); }
        catch (Exception e) { return "{}"; }
    }
}
