package com.cocodi.clothes.application.service;

import com.cocodi.clothes.domain.model.Category;
import com.cocodi.clothes.domain.model.Closet;
import com.cocodi.clothes.domain.model.Clothes;
import com.cocodi.clothes.domain.repository.ClosetCustomRepository;
import com.cocodi.clothes.domain.repository.ClosetRepository;
import com.cocodi.member.domain.model.Member;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClosetService {

    private final ClosetCustomRepository closetCustomRepository;
    private final ClosetRepository closetRepository;
    private final EntityManager entityManager;

    @Transactional
    public Closet createCloset(Long clothesId, Long memberId) {
        Member member = entityManager.getReference(Member.class, memberId);
        Clothes clothes = entityManager.getReference(Clothes.class, clothesId);
        Closet closet = new Closet(null, member, clothes);
        return closetRepository.save(closet);
    }

    @Transactional
    public void deleteCloset(Long clothesId, Long memberId) {
        closetRepository.deleteByClothesIdAndMemberId(clothesId, memberId);
    }

    public List<Clothes> findClothesBy_MemberAndCategory(Long memberId, Category category, Pageable pageable) {
        return closetCustomRepository.findClothesBy_MemberAndCategory(memberId, category, pageable);
    }

    public List<Long> findClothesListByMember(Long memberId) {
        return closetRepository.findCloset_Clothes_ClothesIdByMember_MemberId(memberId);
    }
}
