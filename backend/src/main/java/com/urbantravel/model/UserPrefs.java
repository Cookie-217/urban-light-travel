package com.urbantravel.model;

import java.util.List;

/** 用户出行偏好，序列化为 User.preferences 字段的 JSON */
public class UserPrefs {
    public List<String> transportModes = java.util.Arrays.asList("walk", "bike", "metro");
    public List<String> interests = java.util.Arrays.asList("park", "food", "culture");
    public Double maxBudget = 300.0;
    public Double maxDistanceKm = 12.0;

    public UserPrefs() {}
}
