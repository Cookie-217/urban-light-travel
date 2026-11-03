package com.urbantravel.controller;

import com.urbantravel.model.dto.PoiDto;
import com.urbantravel.model.entity.Poi;
import com.urbantravel.repository.PoiRepository;
import com.urbantravel.service.PoiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pois")
public class PoiController {

    private final PoiService poiService;
    private final PoiRepository poiRepository;

    public PoiController(PoiService poiService, PoiRepository poiRepository) {
        this.poiService = poiService;
        this.poiRepository = poiRepository;
    }

    @GetMapping
    public ResponseEntity<List<PoiDto>> list(@RequestParam(required = false) String city,
                                            @RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(poiService.search(city, keyword));
    }

    @GetMapping("/cities")
    public ResponseEntity<List<String>> cities() {
        return ResponseEntity.ok(poiService.cities());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PoiDto> get(@PathVariable Long id) {
        return poiService.byIds(java.util.Collections.singletonList(id)).stream()
                .findFirst()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<PoiDto> create(@RequestBody PoiDto d) {
        Poi p = toEntity(d);
        return ResponseEntity.ok(PoiDto.from(poiRepository.save(p)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PoiDto> update(@PathVariable Long id, @RequestBody PoiDto d) {
        Poi p = poiRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("POI不存在"));
        apply(d, p);
        return ResponseEntity.ok(PoiDto.from(poiRepository.save(p)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        poiRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    private Poi toEntity(PoiDto d) {
        Poi p = new Poi();
        apply(d, p);
        return p;
    }

    private void apply(PoiDto d, Poi p) {
        if (d.name != null) p.setName(d.name);
        if (d.category != null) p.setCategory(d.category);
        if (d.lng != 0) p.setLng(d.lng);
        if (d.lat != 0) p.setLat(d.lat);
        if (d.address != null) p.setAddress(d.address);
        p.setRating(d.rating);
        p.setPriceLevel(d.priceLevel);
        if (d.tags != null) p.setTags(d.tags);
        if (d.avgDurationMin != 0) p.setAvgDurationMin(d.avgDurationMin);
        if (d.city != null) p.setCity(d.city);
        if (d.openHours != null) p.setOpenHours(d.openHours);
        if (d.description != null) p.setDescription(d.description);
        if (d.wiki != null) p.setWiki(d.wiki);
        if (d.province != null) p.setProvince(d.province);
    }
}
