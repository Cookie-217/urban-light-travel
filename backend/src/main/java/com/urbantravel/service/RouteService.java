package com.urbantravel.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.urbantravel.model.dto.PlanDto.RoutePlan;
import com.urbantravel.model.dto.RouteDto.SaveRouteRequest;
import com.urbantravel.model.dto.RouteDto.SavedRoute;
import com.urbantravel.model.entity.Route;
import com.urbantravel.repository.RouteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RouteService {

    private final RouteRepository routeRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public RouteService(RouteRepository routeRepository) {
        this.routeRepository = routeRepository;
    }

    @Transactional
    public SavedRoute save(Long userId, SaveRouteRequest req) {
        if (req.plan == null || req.plan.steps == null || req.plan.steps.isEmpty()) {
            throw new IllegalArgumentException("路线方案不能为空");
        }
        Route r = new Route();
        r.setUserId(userId);
        r.setTitle(req.title == null || req.title.isEmpty()
                ? defaultTitle(req.plan) : req.title);
        r.setTransportMode(req.transportMode == null ? req.plan.steps.get(0).mode : req.transportMode);
        r.setTotalDistanceKm(req.plan.totalDistanceKm);
        r.setTotalDurationMin(req.plan.totalDurationMin);
        r.setTotalCost(req.plan.totalCost);
        r.setSummary(req.plan.summary);
        List<Long> ids = req.plan.steps.stream()
                .map(s -> s.poi.id).collect(Collectors.toList());
        try {
            r.setPoiIds(objectMapper.writeValueAsString(ids));
            r.setLegsJson(objectMapper.writeValueAsString(req.plan));
        } catch (Exception e) {
            throw new RuntimeException("序列化失败", e);
        }
        Route saved = routeRepository.save(r);
        return toSaved(saved);
    }

    public List<SavedRoute> list(Long userId) {
        return routeRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::toSaved).collect(Collectors.toList());
    }

    @Transactional
    public void delete(Long userId, Long routeId) {
        Route r = routeRepository.findById(routeId)
                .orElseThrow(() -> new IllegalArgumentException("路线不存在"));
        if (!r.getUserId().equals(userId)) throw new IllegalArgumentException("无权操作");
        routeRepository.delete(r);
    }

    private SavedRoute toSaved(Route r) {
        SavedRoute s = new SavedRoute();
        s.id = r.getId();
        s.title = r.getTitle();
        s.transportMode = r.getTransportMode();
        s.createdAt = r.getCreatedAt();
        try {
            s.plan = objectMapper.readValue(r.getLegsJson(), RoutePlan.class);
        } catch (Exception e) {
            s.plan = new RoutePlan();
        }
        return s;
    }

    private String defaultTitle(RoutePlan plan) {
        String mode = plan.steps.isEmpty() ? "walk" : plan.steps.get(0).mode;
        return "我的轻出行路线（" + RecommendationService.modeName(mode) + "）";
    }
}
