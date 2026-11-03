package com.urbantravel.model.entity;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "routes")
public class Route {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(nullable = false, length = 128)
    private String title;

    @Column(name = "transport_mode", length = 32)
    private String transportMode;

    @Column(name = "total_distance_km")
    private double totalDistanceKm;

    @Column(name = "total_duration_min")
    private int totalDurationMin;

    @Column(name = "total_cost")
    private double totalCost;

    /** JSON 数组：[poiId, ...] */
    @Column(name = "poi_ids", columnDefinition = "TEXT")
    private String poiIds;

    /** JSON 数组：每段明细（距离/时长/费用/方式） */
    @Column(name = "legs_json", columnDefinition = "TEXT")
    private String legsJson;

    /** 行程概述（可能由 AI 生成） */
    @Column(name = "summary", columnDefinition = "TEXT")
    private String summary;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Route() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getTransportMode() { return transportMode; }
    public void setTransportMode(String transportMode) { this.transportMode = transportMode; }
    public double getTotalDistanceKm() { return totalDistanceKm; }
    public void setTotalDistanceKm(double v) { this.totalDistanceKm = v; }
    public int getTotalDurationMin() { return totalDurationMin; }
    public void setTotalDurationMin(int v) { this.totalDurationMin = v; }
    public double getTotalCost() { return totalCost; }
    public void setTotalCost(double v) { this.totalCost = v; }
    public String getPoiIds() { return poiIds; }
    public void setPoiIds(String v) { this.poiIds = v; }
    public String getLegsJson() { return legsJson; }
    public void setLegsJson(String v) { this.legsJson = v; }
    public String getSummary() { return summary; }
    public void setSummary(String v) { this.summary = v; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime v) { this.createdAt = v; }
}
