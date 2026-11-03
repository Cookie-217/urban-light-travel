package com.urbantravel.data;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * 统一数据源：读取 classpath:pois.json（与前端同源），为后端提供全国城市中心点
 * 与 POI 基础数据，保证「连上后端后城市与前端完全一致」。
 * 该 JSON 由 tools/generate-data.js 从 data/pois.js 生成，作为 classpath 资源随后端一起提交（运行时读取），
 * 其源头 data/pois.js 与生成脚本 tools/generate-data.js 也一并入库，便于追溯与重新生成。
 */
@Component
public class UnifiedData {

    private static final Logger log = LoggerFactory.getLogger(UnifiedData.class);
    private static final String RESOURCE = "pois.json";

    private final ObjectMapper objectMapper;

    private List<PoiEntry> pois = new ArrayList<>();
    private List<CityEntry> cities = new ArrayList<>();
    private Map<String, double[]> cityCenters = new LinkedHashMap<>();

    @Autowired
    public UnifiedData(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @PostConstruct
    public void load() {
        try (InputStream in = new ClassPathResource(RESOURCE).getInputStream()) {
            Root root = objectMapper.readValue(in, Root.class);
            this.pois = root.pois != null ? root.pois : new ArrayList<>();
            this.cities = root.cities != null ? root.cities : new ArrayList<>();
            Map<String, double[]> centers = new LinkedHashMap<>();
            for (CityEntry c : this.cities) {
                if (c != null && c.name != null && c.center != null && c.center.length >= 2) {
                    centers.put(c.name, new double[]{c.center[0], c.center[1]}); // [lat, lng]
                }
            }
            this.cityCenters = centers;
            log.info("已加载统一数据源 pois.json：{} 个城市，{} 个 POI", this.cities.size(), this.pois.size());
        } catch (Exception e) {
            log.error("加载统一数据源 {} 失败：{}", RESOURCE, e.getMessage());
            this.pois = new ArrayList<>();
            this.cities = new ArrayList<>();
            this.cityCenters = new LinkedHashMap<>();
        }
    }

    public List<PoiEntry> getPois() { return pois; }
    public List<CityEntry> getCities() { return cities; }
    public Map<String, double[]> getCityCenters() { return cityCenters; }

    @JsonIgnoreProperties(ignoreUnknown = true)
    static class Root {
        public String version;
        public String generatedAt;
        public String source;
        public List<CityEntry> cities;
        public List<PoiEntry> pois;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class CityEntry {
        public String name;
        public String province;
        public double[] center; // [lat, lng]
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class PoiEntry {
        public int srcId;
        public String name;
        public String category;
        public double lng;
        public double lat;
        public String address;
        public double rating;
        public int priceLevel;
        public String tags;
        public int avgDurationMin;
        public String city;
        public String province;
        public String openHours;
        public String description;
        public String wiki;
    }
}
