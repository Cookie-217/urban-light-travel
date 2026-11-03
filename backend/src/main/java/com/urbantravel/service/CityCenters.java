package com.urbantravel.service;

import com.urbantravel.data.UnifiedData;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * 主要城市中心点坐标，供 AI 聊天在未指定起点时作为默认出行原点。
 * 数据来自统一数据源 pois.json（与前端同源），覆盖全国 69 个城市。
 */
@Component
public class CityCenters {

    private static final String FALLBACK = "杭州";

    private final UnifiedData unifiedData;
    private final Map<String, double[]> centers = new LinkedHashMap<>();
    private final List<String> cityNames = new ArrayList<>();

    public CityCenters(UnifiedData unifiedData) {
        this.unifiedData = unifiedData;
    }

    @PostConstruct
    public void init() {
        centers.clear();
        cityNames.clear();
        for (Map.Entry<String, double[]> e : unifiedData.getCityCenters().entrySet()) {
            centers.put(e.getKey(), e.getValue());
            cityNames.add(e.getKey());
        }
        if (!centers.containsKey(FALLBACK)) centers.put(FALLBACK, new double[]{30.2741, 120.1551});
    }

    /** 返回全部城市名（用于 AI 意图识别中「从消息抽取城市」） */
    public List<String> cityNames() { return cityNames; }

    public boolean contains(String city) {
        return city != null && centers.containsKey(city);
    }

    /** 精确匹配优先；否则做子串模糊匹配；都没有则返回默认城市（杭州）中心点 [lat,lng] */
    public double[] get(String city) {
        if (city != null && centers.containsKey(city)) return centers.get(city);
        if (city != null) {
            for (Map.Entry<String, double[]> e : centers.entrySet()) {
                if (city.contains(e.getKey()) || e.getKey().contains(city)) return e.getValue();
            }
        }
        return centers.get(FALLBACK);
    }
}
