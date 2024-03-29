package com.cocodi.clothes.domain.repository;

import com.cocodi.clothes.domain.model.Category;
import com.cocodi.clothes.domain.model.Clothes;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ClosetCustomRepository {
    List<Clothes> findClothesBy_MemberAndCategory(Long memberId, Category category, Pageable pageable);
}
