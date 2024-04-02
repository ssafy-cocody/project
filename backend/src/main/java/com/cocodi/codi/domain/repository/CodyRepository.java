package com.cocodi.codi.domain.repository;

import com.cocodi.codi.domain.model.Cody;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CodyRepository extends JpaRepository<Cody, Long> {

    Optional<Cody> findByTopClothesIdAndBottomClothesIdAndOuterClothesIdAndOnepieceClothesIdAndShoesClothesId(
            Long topId,
            Long bottomId,
            Long outerId,
            Long onepieceId,
            Long shoesId);

//    @Query(value = "INSERT INTO cody " +
//            "(image, top_clothes_id, bottom_clothes_id, outer_clothes_id, onepiece_clothes_id, shoes_clothes_id) " +
//            "VALUES (:codyImage, :topId, :bottomId, :outerId, :onepieceId, :shoesId)", nativeQuery = true)
//    void saveByNativeQuery(
//            @Param("codyImage") String codyImage,
//            @Param("topId") Long topId,
//            @Param("bottomId") Long bottomId,
//            @Param("outerId") Long outerId,
//            @Param("onepieceId") Long onepieceId,
//            @Param("shoesId") Long shoesId);
}
