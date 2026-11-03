package com.urbantravel.model.dto;

import java.time.LocalDateTime;
import java.util.List;

public class RouteDto {

    public static class SaveRouteRequest {
        public String title;
        public String transportMode;
        public PlanDto.RoutePlan plan;   // 前端传回由推荐引擎生成的完整方案
    }

    public static class SavedRoute {
        public Long id;
        public String title;
        public String transportMode;
        public PlanDto.RoutePlan plan;
        public LocalDateTime createdAt;

        public SavedRoute() {}
    }
}
