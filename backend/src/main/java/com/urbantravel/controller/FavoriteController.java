package com.urbantravel.controller;

import com.urbantravel.model.dto.PoiDto;
import com.urbantravel.model.dto.RouteDto.SavedRoute;
import com.urbantravel.security.CurrentUserService;
import com.urbantravel.service.FavoriteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    private final FavoriteService favoriteService;
    private final CurrentUserService currentUserService;

    public FavoriteController(FavoriteService favoriteService, CurrentUserService currentUserService) {
        this.favoriteService = favoriteService;
        this.currentUserService = currentUserService;
    }

    public static class FavoriteRequest {
        public String type;   // POI / ROUTE
        public Long refId;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> toggle(@RequestBody FavoriteRequest req) {
        Long uid = currentUserService.requireUserId();
        boolean favorited = favoriteService.toggle(uid, req.type, req.refId);
        Map<String, Object> m = new HashMap<>();
        m.put("favorited", favorited);
        return ResponseEntity.ok(m);
    }

    @GetMapping("/check")
    public ResponseEntity<Map<String, Object>> check(@RequestParam String type, @RequestParam Long refId) {
        Long uid = currentUserService.requireUserId();
        Map<String, Object> m = new HashMap<>();
        m.put("favorited", favoriteService.isFavorited(uid, type, refId));
        return ResponseEntity.ok(m);
    }

    @GetMapping("/pois")
    public ResponseEntity<List<PoiDto>> pois() {
        Long uid = currentUserService.requireUserId();
        return ResponseEntity.ok(favoriteService.listPois(uid));
    }

    @GetMapping("/routes")
    public ResponseEntity<List<SavedRoute>> routes() {
        Long uid = currentUserService.requireUserId();
        return ResponseEntity.ok(favoriteService.listRoutes(uid));
    }
}
