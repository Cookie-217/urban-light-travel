package com.urbantravel.repository;

import com.urbantravel.model.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findByUserIdAndTypeOrderByCreatedAtDesc(Long userId, String type);
    Optional<Favorite> findByUserIdAndTypeAndRefId(Long userId, String type, Long refId);
    void deleteByUserIdAndTypeAndRefId(Long userId, String type, Long refId);
}
