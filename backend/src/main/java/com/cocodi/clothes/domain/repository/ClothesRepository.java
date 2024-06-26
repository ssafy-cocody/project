package com.cocodi.clothes.domain.repository;

import com.cocodi.clothes.domain.model.Clothes;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClothesRepository extends JpaRepository<Clothes, Long> {
    List<Clothes> findByClothesIdIn(List<Long> collection);
    List<Clothes> findByProductNo(String productNo);
}
