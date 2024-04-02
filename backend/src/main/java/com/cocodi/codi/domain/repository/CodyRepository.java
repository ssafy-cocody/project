package com.cocodi.codi.domain.repository;

import com.cocodi.codi.domain.model.Cody;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface CodyRepository extends JpaRepository<Cody, Long> {

    @Query(value = "SELECT * FROM cody WHERE " +
            "top_clothes_id = :topId " +
            "AND bottom_clothes_id = :bottomId " +
            "AND outer_clothes_id = :outerId " +
            "AND onepiece_clothes_id = :onepieceId " +
            "AND shoes_clothes_id = :shoesId"
    , nativeQuery = true)
    Optional<Cody> findByTopAndBottomAndOuterAndOnepieceAndShoes(
            @Param("topId") Long topId,
            @Param("bottomId") Long bottomId,
            @Param("outerId") Long outerId,
            @Param("onepieceId") Long onepieceId,
            @Param("shoesId") Long shoesId);

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
