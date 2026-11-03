package com.urbantravel.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

/** 调用 Open-Meteo（无需 API Key）获取实时天气，用于天气感知的路线推荐 */
@Service
public class WeatherService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final boolean enabled;

    public WeatherService(@Value("${app.weather-enabled:true}") boolean enabled) {
        this.enabled = enabled;
    }

    public static class WeatherInfo {
        public String description;   // 中文描述
        public double temperature;
        public int weatherCode;
        public boolean isBadForOutdoor; // 雨/雪/大风等
    }

    public WeatherInfo getWeather(double lat, double lng) {
        WeatherInfo fallback = new WeatherInfo();
        fallback.description = "未知";
        fallback.isBadForOutdoor = false;
        if (!enabled) return fallback;

        try {
            String url = String.format(
                    "https://api.open-meteo.com/v1/forecast?latitude=%.4f&longitude=%.4f&current_weather=true",
                    lat, lng);
            Map<?, ?> resp = restTemplate.getForObject(url, Map.class);
            if (resp == null) return fallback;
            Object cw = resp.get("current_weather");
            if (!(cw instanceof Map)) return fallback;
            Map<?, ?> cur = (Map<?, ?>) cw;
            int code = ((Number) cur.get("weathercode")).intValue();
            double temp = ((Number) cur.get("temperature")).doubleValue();
            WeatherInfo info = new WeatherInfo();
            info.weatherCode = code;
            info.temperature = temp;
            info.description = describe(code);
            info.isBadForOutdoor = isBad(code);
            return info;
        } catch (Exception e) {
            return fallback;
        }
    }

    private String describe(int code) {
        // WMO weather code（简化）
        if (code == 0) return "晴";
        if (code <= 3) return "多云";
        if (code <= 48) return "雾/霜";
        if (code <= 67) return "雨";
        if (code <= 77) return "雪";
        if (code <= 82) return "阵雨";
        if (code <= 99) return "雷暴";
        return "未知";
    }

    private boolean isBad(int code) {
        return code >= 51; // 降雨/雪/雷暴对户外不友好
    }
}
