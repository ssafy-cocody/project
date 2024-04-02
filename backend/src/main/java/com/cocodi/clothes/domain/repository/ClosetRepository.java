package com.cocodi.clothes.domain.repository;

import com.cocodi.clothes.domain.model.Closet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClosetRepository extends JpaRepository<Closet, Long> {

    List<Long> findClothesClothesIdByMemberMemberId(Long memberId);
}
