package com.urbantravel.service;

import java.util.HashMap;
import java.util.Map;

/** 主要城市中心点坐标，供 AI 聊天在未指定起点时作为默认出行原点 */
public class CityCenters {
    private static final Map<String, double[]> CENTERS = new HashMap<>();
    static {
        CENTERS.put("杭州", new double[]{30.2741, 120.1551});
        CENTERS.put("北京", new double[]{39.9042, 116.4074});
        CENTERS.put("上海", new double[]{31.2304, 121.4737});
        CENTERS.put("成都", new double[]{30.5728, 104.0668});
        CENTERS.put("深圳", new double[]{22.5431, 114.0579});
        CENTERS.put("广州", new double[]{23.1291, 113.2644});
        CENTERS.put("西安", new double[]{34.3416, 108.9398});
        CENTERS.put("南京", new double[]{32.0603, 118.7969});
        CENTERS.put("重庆", new double[]{29.5630, 106.5516});
        CENTERS.put("武汉", new double[]{30.5928, 114.3055});
    }

    public static double[] get(String city) {
        if (city == null) return CENTERS.get("杭州");
        for (Map.Entry<String, double[]> e : CENTERS.entrySet()) {
            if (city.contains(e.getKey()) || e.getKey().contains(city)) return e.getValue();
        }
        return CENTERS.get("杭州");
    }

    public static boolean contains(String city) {
        return city != null && CENTERS.containsKey(city);
    }
}
