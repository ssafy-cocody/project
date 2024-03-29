package com.cocodi.clothes.domain.repository;

import com.cocodi.clothes.domain.model.Closet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
public interface ClosetRepository extends JpaRepository<Closet, Long> {
    @Modifying
    @Query("DELETE FROM Closet c WHERE c.clothes.clothesId = :clothesId AND c.member.memberId = :memberId")
    void deleteByClothesIdAndMemberId(@Param("clothesId") Long clothesId, @Param("memberId") Long memberId);
}
