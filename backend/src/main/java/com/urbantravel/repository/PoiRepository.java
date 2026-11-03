package com.urbantravel.repository;

import com.urbantravel.model.entity.Poi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PoiRepository extends JpaRepository<Poi, Long> {

    List<Poi> findByCity(String city);

    List<Poi> findByCategoryIn(List<String> categories);

    List<Poi> findByCityAndCategoryIn(String city, List<String> categories);

    @Query("SELECT p FROM Poi p WHERE " +
           "(:city IS NULL OR p.city = :city) AND " +
           "(:keyword IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%',:keyword,'%')) OR " +
           "LOWER(p.tags) LIKE LOWER(CONCAT('%',:keyword,'%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%',:keyword,'%')))")
    List<Poi> search(@Param("city") String city, @Param("keyword") String keyword);
}
