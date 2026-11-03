package com.urbantravel.model.dto;

public class PoiDto {
    public Long id;
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
    public String openHours;
    public String description;
    public String wiki;
    public String province;

    public PoiDto() {}

    public static PoiDto from(com.urbantravel.model.entity.Poi p) {
        PoiDto d = new PoiDto();
        d.id = p.getId(); d.name = p.getName(); d.category = p.getCategory();
        d.lng = p.getLng(); d.lat = p.getLat(); d.address = p.getAddress();
        d.rating = p.getRating(); d.priceLevel = p.getPriceLevel(); d.tags = p.getTags();
        d.avgDurationMin = p.getAvgDurationMin(); d.city = p.getCity();
        d.openHours = p.getOpenHours(); d.description = p.getDescription();
        d.wiki = p.getWiki(); d.province = p.getProvince();
        return d;
    }
}
