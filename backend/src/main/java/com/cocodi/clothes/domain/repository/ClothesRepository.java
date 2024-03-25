package com.cocodi.clothes.domain.repository;

import com.cocodi.clothes.domain.model.Clothes;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClothesRepository extends JpaRepository<Clothes, Long> {

}
