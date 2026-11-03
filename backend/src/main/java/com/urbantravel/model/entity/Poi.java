package com.urbantravel.model.entity;

import javax.persistence.*;

@Entity
@Table(name = "pois", indexes = {
        @Index(name = "idx_poi_city", columnList = "city"),
        @Index(name = "idx_poi_category", columnList = "category")
})
public class Poi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 128)
    private String name;

    /** park / food / culture / shopping / transit / nature / night */
    @Column(nullable = false, length = 32)
    private String category;

    @Column(nullable = false)
    private double lng;

    @Column(nullable = false)
    private double lat;

    @Column(length = 255)
    private String address;

    /** 评分 0-5 */
    private double rating = 0.0;

    /** 价格水平 1-4 */
    private int priceLevel = 1;

    /** 逗号分隔标签 */
    @Column(length = 255)
    private String tags;

    /** 建议游览时长（分钟） */
    @Column(name = "avg_duration_min")
    private int avgDurationMin = 60;

    @Column(length = 64)
    private String city;

    @Column(name = "open_hours", length = 64)
    private String openHours;

    @Column(columnDefinition = "TEXT")
    private String description;

    public Poi() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public double getLng() { return lng; }
    public void setLng(double lng) { this.lng = lng; }
    public double getLat() { return lat; }
    public void setLat(double lat) { this.lat = lat; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }
    public int getPriceLevel() { return priceLevel; }
    public void setPriceLevel(int priceLevel) { this.priceLevel = priceLevel; }
    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }
    public int getAvgDurationMin() { return avgDurationMin; }
    public void setAvgDurationMin(int avgDurationMin) { this.avgDurationMin = avgDurationMin; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getOpenHours() { return openHours; }
    public void setOpenHours(String openHours) { this.openHours = openHours; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
