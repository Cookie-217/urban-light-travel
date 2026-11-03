package com.urbantravel.controller;

import com.urbantravel.model.dto.PlanDto;
import com.urbantravel.model.dto.PlanDto.PlanRequest;
import com.urbantravel.model.dto.PlanDto.RoutePlan;
import com.urbantravel.model.dto.RouteDto.SaveRouteRequest;
import com.urbantravel.model.dto.RouteDto.SavedRoute;
import com.urbantravel.security.CurrentUserService;
import com.urbantravel.service.RecommendationService;
import com.urbantravel.service.RouteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class RouteController {

    private final RecommendationService recommendationService;
    private final RouteService routeService;
    private final CurrentUserService currentUserService;

    public RouteController(RecommendationService recommendationService, RouteService routeService,
                           CurrentUserService currentUserService) {
        this.recommendationService = recommendationService;
        this.routeService = routeService;
        this.currentUserService = currentUserService;
    }

    /** 公开：生成路线方案（无需登录，便于演示与 AI 调用） */
    @PostMapping("/plan")
    public ResponseEntity<RoutePlan> plan(@RequestBody PlanDto.PlanRequest req) {
        return ResponseEntity.ok(recommendationService.plan(req));
    }

    @GetMapping("/routes")
    public ResponseEntity<List<SavedRoute>> myRoutes() {
        Long uid = currentUserService.requireUserId();
        return ResponseEntity.ok(routeService.list(uid));
    }

    @PostMapping("/routes")
    public ResponseEntity<SavedRoute> save(@RequestBody SaveRouteRequest req) {
        Long uid = currentUserService.requireUserId();
        return ResponseEntity.ok(routeService.save(uid, req));
    }

    @DeleteMapping("/routes/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        Long uid = currentUserService.requireUserId();
        routeService.delete(uid, id);
        return ResponseEntity.ok().build();
    }
}
