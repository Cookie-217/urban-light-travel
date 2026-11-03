package com.urbantravel.model.dto;

import java.util.List;

public class PlanDto {

    public static class PlanRequest {
        public double originLat;
        public double originLng;
        public String transportMode = "walk";   // walk / bike / metro / bus / taxi / mixed
        public double timeBudgetHours = 4.0;
        public List<String> interests;          // park / food / culture / shopping / nature / night
        public Double maxBudget;                // 元
        public String city;
        public boolean useWeather = true;
    }

    public static class RouteStep {
        public PoiDto poi;
        public double distanceFromPrevKm;
        public int durationMin;
        public String mode;
        public double cost;

        public RouteStep() {}
        public RouteStep(PoiDto poi, double distanceFromPrevKm, int durationMin, String mode, double cost) {
            this.poi = poi; this.distanceFromPrevKm = distanceFromPrevKm;
            this.durationMin = durationMin; this.mode = mode; this.cost = cost;
        }
    }

    public static class RoutePlan {
        public List<RouteStep> steps;
        public double totalDistanceKm;
        public int totalDurationMin;
        public double totalCost;
        public String summary;
        public List<List<Double>> polyline;   // [lng, lat]
        public String weatherNote;
        public boolean usedAi;

        public RoutePlan() {}
    }
}
