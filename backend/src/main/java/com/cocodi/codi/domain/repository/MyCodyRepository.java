package com.cocodi.codi.domain.repository;

import com.cocodi.codi.domain.model.Cody;
import com.cocodi.codi.domain.model.MyCody;
import com.cocodi.member.domain.model.Member;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MyCodyRepository extends JpaRepository<MyCody, Long> {

    Slice<MyCody> findMyCodiesByMemberOrderByMyCodiIdDesc(Member member, Pageable pageable);

    Optional<MyCody> findByMemberAndCody(Member member, Cody cody);

    Long countByMyCodiIdGreaterThan(Long myCodyId);

    Optional<MyCody> findByMemberAndMyCodiId(Member member, Long myCodyId);

    Optional<Object> findByMemberAndCodyCodiId(Member member, Long codyId);

//    @Query("SELECT m FROM MyCody m JOIN m.cody c WHERE m.member = :member " +
//            "AND c.top.clothesId = :topId " +
//            "AND c.bottom.clothesId = :bottomId " +
//            "AND c.outer.clothesId = :outerId " +
//            "AND c.onepiece.clothesId = :onepieceId " +
//            "AND c.shoes.clothesId = :shoesId")
//    Optional<MyCody> findByMemberWithCody(
//            @Param("topId") Long topId,
//            @Param("bottomId") Long bottomId,
//            @Param("outerId") Long outerId,
//            @Param("onepieceId") Long onepieceId,
//            @Param("shoesId") Long shoesId,
//            @Param("member") Member member
//    );
}
