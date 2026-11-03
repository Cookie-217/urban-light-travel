package com.urbantravel.service;

import com.urbantravel.model.dto.PoiDto;
import com.urbantravel.model.entity.Poi;
import com.urbantravel.repository.PoiRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PoiService {

    private final PoiRepository poiRepository;

    public PoiService(PoiRepository poiRepository) {
        this.poiRepository = poiRepository;
    }

    public List<PoiDto> search(String city, String keyword) {
        return poiRepository.search(city, keyword == null || keyword.isEmpty() ? null : keyword)
                .stream().map(PoiDto::from).collect(Collectors.toList());
    }

    public List<PoiDto> byCity(String city) {
        return poiRepository.findByCity(city).stream().map(PoiDto::from).collect(Collectors.toList());
    }

    public List<PoiDto> byIds(List<Long> ids) {
        if (ids == null || ids.isEmpty()) return java.util.Collections.emptyList();
        return poiRepository.findAllById(ids).stream().map(PoiDto::from).collect(Collectors.toList());
    }

    public List<Poi> findAllByIds(List<Long> ids) {
        return poiRepository.findAllById(ids);
    }

    public List<String> cities() {
        return poiRepository.findAll().stream()
                .map(Poi::getCity).distinct().sorted().collect(Collectors.toList());
    }

    public long count() {
        return poiRepository.count();
    }
}
