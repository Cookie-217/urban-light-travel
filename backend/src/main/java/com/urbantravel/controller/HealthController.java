package com.urbantravel.controller;

import com.urbantravel.service.PoiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    private final PoiService poiService;

    public HealthController(PoiService poiService) {
        this.poiService = poiService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> m = new HashMap<>();
        m.put("status", "UP");
        m.put("service", "urban-light-travel");
        m.put("poiCount", poiService.count());
        m.put("cities", poiService.cities());
        return ResponseEntity.ok(m);
    }
}
