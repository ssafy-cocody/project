package com.cocodi.clothes.infrastructure.persistance;

import com.cocodi.clothes.domain.model.Category;
import com.cocodi.clothes.domain.model.Clothes;
import com.cocodi.clothes.domain.model.QCloset;
import com.cocodi.clothes.domain.model.QClothes;
import com.cocodi.clothes.domain.repository.ClosetCustomRepository;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class ClosetCustomRepositoryImpl implements ClosetCustomRepository {
    private final JPAQueryFactory jpaQueryFactory;
    QClothes qClothes = QClothes.clothes;
    QCloset qCloset = QCloset.closet;


    @Override
    public List<Clothes> findClothesBy_MemberAndCategory(Long memberId, Category category, Pageable pageable) {
        BooleanBuilder booleanBuilder = buildConditionForClothesByMemberAndCategory(memberId, category);

        return jpaQueryFactory
                .selectFrom(qClothes)
                .where(booleanBuilder)
                .orderBy(qClothes.clothesId.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize() + 1)
                .fetch();
    }

    private BooleanBuilder buildConditionForClothesByMemberAndCategory(Long memberId, Category category) {
        BooleanBuilder booleanBuilder = new BooleanBuilder();
        if (category != null) {
            booleanBuilder.and(qClothes.category.eq(category));
        }

        return booleanBuilder.and(qClothes.in(
                JPAExpressions.select(qCloset.clothes)
                        .from(qCloset)
                        .where(qCloset.member.memberId.eq(memberId))
        ));
    }
}
