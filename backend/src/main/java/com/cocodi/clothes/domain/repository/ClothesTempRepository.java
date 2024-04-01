package com.cocodi.clothes.domain.repository;

import com.cocodi.clothes.domain.model.ClothesTemp;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClothesTempRepository extends CrudRepository<ClothesTemp, String> {
    boolean existsById(@NotNull String uuid);
}
