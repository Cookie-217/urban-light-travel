package com.urbantravel.data;

import com.urbantravel.data.UnifiedData.PoiEntry;
import com.urbantravel.model.entity.Poi;
import com.urbantravel.model.entity.User;
import com.urbantravel.model.enums.Role;
import com.urbantravel.repository.PoiRepository;
import com.urbantravel.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/** 初始化示例 POI 数据与默认账号（仅在库为空时写入）。POI 数据来自统一数据源 pois.json，保证与前端一致。 */
@Component
public class DataSeeder implements CommandLineRunner {

    private final PoiRepository poiRepository;
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder;
    private final UnifiedData unifiedData;

    public DataSeeder(PoiRepository poiRepository, UserRepository userRepository,
                      BCryptPasswordEncoder encoder, UnifiedData unifiedData) {
        this.poiRepository = poiRepository;
        this.userRepository = userRepository;
        this.encoder = encoder;
        this.unifiedData = unifiedData;
    }

    @Override
    public void run(String... args) {
        if (poiRepository.count() == 0) {
            poiRepository.saveAll(buildPois());
        }
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPasswordHash(encoder.encode("admin123"));
            admin.setEmail("admin@urbantravel.com");
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);
        }
        if (!userRepository.existsByUsername("demo")) {
            User demo = new User();
            demo.setUsername("demo");
            demo.setPasswordHash(encoder.encode("demo123"));
            demo.setEmail("demo@urbantravel.com");
            demo.setRole(Role.USER);
            userRepository.save(demo);
        }
    }

    private Poi toEntity(PoiEntry e) {
        Poi x = new Poi();
        x.setName(e.name);
        x.setCategory(e.category);
        x.setLng(e.lng);
        x.setLat(e.lat);
        x.setAddress(e.address);
        x.setRating(e.rating);
        x.setPriceLevel(e.priceLevel);
        x.setTags(e.tags);
        x.setAvgDurationMin(e.avgDurationMin);
        x.setCity(e.city);
        x.setProvince(e.province);
        x.setOpenHours(e.openHours);
        x.setDescription(e.description);
        x.setWiki(e.wiki);
        return x;
    }

    private List<Poi> buildPois() {
        List<Poi> list = new ArrayList<>();
        for (PoiEntry e : unifiedData.getPois()) {
            if (e == null || e.name == null) continue;
            list.add(toEntity(e));
        }
        return list;
    }
}
