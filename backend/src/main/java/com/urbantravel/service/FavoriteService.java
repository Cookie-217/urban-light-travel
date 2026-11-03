package com.urbantravel.service;

import com.urbantravel.model.dto.PoiDto;
import com.urbantravel.model.dto.RouteDto.SavedRoute;
import com.urbantravel.model.entity.Favorite;
import com.urbantravel.repository.FavoriteRepository;
import com.urbantravel.repository.RouteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final PoiService poiService;
    private final RouteRepository routeRepository;
    private final RouteService routeService;

    public FavoriteService(FavoriteRepository favoriteRepository, PoiService poiService,
                           RouteRepository routeRepository, RouteService routeService) {
        this.favoriteRepository = favoriteRepository;
        this.poiService = poiService;
        this.routeRepository = routeRepository;
        this.routeService = routeService;
    }

    @Transactional
    public boolean toggle(Long userId, String type, Long refId) {
        return favoriteRepository.findByUserIdAndTypeAndRefId(userId, type, refId)
                .map(f -> { favoriteRepository.delete(f); return false; })
                .orElseGet(() -> {
                    Favorite f = new Favorite();
                    f.setUserId(userId); f.setType(type); f.setRefId(refId);
                    favoriteRepository.save(f);
                    return true;
                });
    }

    public boolean isFavorited(Long userId, String type, Long refId) {
        return favoriteRepository.findByUserIdAndTypeAndRefId(userId, type, refId).isPresent();
    }

    public List<PoiDto> listPois(Long userId) {
        return favoriteRepository.findByUserIdAndTypeOrderByCreatedAtDesc(userId, "POI").stream()
                .map(f -> poiService.byIds(java.util.Collections.singletonList(f.getRefId())))
                .flatMap(List::stream)
                .collect(Collectors.toList());
    }

    public List<SavedRoute> listRoutes(Long userId) {
        List<Long> ids = favoriteRepository.findByUserIdAndTypeOrderByCreatedAtDesc(userId, "ROUTE").stream()
                .map(Favorite::getRefId).collect(Collectors.toList());
        return ids.stream()
                .map(id -> routeRepository.findById(id))
                .filter(java.util.Optional::isPresent)
                .map(o -> routeService.list(userId).stream()
                        .filter(s -> s.id.equals(o.get().getId())).findFirst().orElse(null))
                .filter(s -> s != null)
                .collect(Collectors.toList());
    }
}
