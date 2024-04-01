package com.cocodi.codi.application.service;

import com.cocodi.clothes.domain.model.Category;
import com.cocodi.clothes.domain.model.Clothes;
import com.cocodi.clothes.domain.repository.ClothesRepository;
import com.cocodi.clothes.presentation.request.ClothesImageRequest;
import com.cocodi.clothes.presentation.request.ClothesRequest;
import com.cocodi.codi.domain.model.Cody;
import com.cocodi.codi.domain.model.MyCody;
import com.cocodi.codi.domain.model.Ootd;
import com.cocodi.codi.domain.repository.CodyRepository;
import com.cocodi.codi.domain.repository.MyCodyRepository;
import com.cocodi.codi.domain.repository.OotdRepository;
import com.cocodi.codi.presentation.request.CodyCreateRequest;
import com.cocodi.codi.presentation.response.CodyResponse;
import com.cocodi.codi.presentation.response.RecommendCodyResponse;
import com.cocodi.common.infrastructure.rabbit.util.RabbitMQUtil;
import com.cocodi.member.domain.model.Member;
import com.cocodi.member.domain.repository.MemberRepository;
import com.cocodi.member.infrastructure.exception.MemberFindException;
import com.cocodi.sse.domain.model.SseObject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Slf4j
@Service
@RequiredArgsConstructor
public class CodyService {

    private final MyCodyRepository myCodyRepository;
    private final CodyRepository codyRepository;
    private final MemberRepository memberRepository;
    private final OotdRepository ootdRepository;
    private final EntityManager entityManager;
    private final ClothesRepository clothesRepository;
    private final RabbitMQUtil rabbitMQUtil;

    public Slice<CodyResponse> findCody(Pageable pageable, Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberFindException("Cannot find Member"));
        Slice<MyCody> myCodies = myCodyRepository.findMyCodiesByMember(member, pageable);
        List<CodyResponse> codyResponses = myCodies.stream()
                .map(myCody -> new CodyResponse(myCody.getMyCodiId(), myCody.getCody().getCodiId(), myCody.getName(), myCody.getCody().getImage()))
                .toList();
        Long lastMyCodyId = codyResponses.get(codyResponses.size() - 1).myCodyId();
        boolean hasNext = myCodyRepository.countByMyCodiIdGreaterThan(lastMyCodyId) > 0;
        return new SliceImpl<>(codyResponses, pageable, hasNext);

    }

    public boolean createCody(CodyCreateRequest codyCreateRequest, Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberFindException("Cannot find Member"));
        Cody cody = getCodyFromRequest(codyCreateRequest.clothesRequest(), null);
        Optional<MyCody> findMyCody = myCodyRepository.findByMemberAndCody(member, cody);
        if (findMyCody.isPresent()) {
            return false;
        }
        MyCody myCody = MyCody.builder()
                .name(codyCreateRequest.name())
                .cody(cody)
                .member(member)
                .build();
        myCodyRepository.save(myCody);
        // todo : 이미지 생성
        return true;
    }

    public void deleteMyCody(Long codyId, Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberFindException("Cannot find Member"));
        Cody cody = codyRepository.findById(codyId)
                .orElseThrow(() -> new RuntimeException("Cannot find Cody"));
        MyCody myCody = myCodyRepository.findByMemberAndCody(member, cody)
                .orElseThrow(() -> new RuntimeException("Cannot find MyCody"));
        myCodyRepository.delete(myCody);
    }

    @Transactional
    public List<RecommendCodyResponse> getRecommendCodyList(List<ClothesRequest> recommendCodyList, List<String> codyImages, LocalDate date, Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberFindException("Cannot find Member"));

        Ootd ootd = ootdRepository.findByMemberAndDate(member, date).orElse(null);
        List<RecommendCodyResponse> recommendCodyResponses = new ArrayList<>();
        IntStream.range(0, recommendCodyList.size())
                .forEach(i -> {
                    ClothesRequest clothesRequest = recommendCodyList.get(i);
                    String codyImage = codyImages.get(i);
                    Cody cody = getCodyFromRequest(clothesRequest, codyImage);
                    boolean isMyOotd = ootd != null && Objects.equals(ootd.getCody().getCodiId(), cody.getCodiId());
                    recommendCodyResponses.add(
                            new RecommendCodyResponse(
                                    cody.getCodiId(),
                                    isMyCody(member, cody),
                                    isMyOotd,
                                    cody.getImage()
                            )
                    );
                });

        return recommendCodyResponses;
    }

    public boolean isMyCody(Member member, Cody cody) {
        return myCodyRepository.findByMemberAndCody(member, cody).isPresent();
    }

    public Cody getCodyFromRequest(ClothesRequest clothesRequest, String codyImage) {
        return codyRepository.findByTopAndBottomAndOuterAndOnepieceAndShoes(
                clothesRequest.topId(),
                clothesRequest.bottomId(),
                clothesRequest.outerId(),
                clothesRequest.onepieceId(),
                clothesRequest.shoesId()
        ).orElseGet(() -> {
            Cody cody = Cody.builder()
                    .image(codyImage)
                    .top(getClothesOrNull(clothesRequest.topId()))
                    .bottom(getClothesOrNull(clothesRequest.bottomId()))
                    .outer(getClothesOrNull(clothesRequest.outerId()))
                    .onepiece(getClothesOrNull(clothesRequest.onepieceId()))
                    .shoes(getClothesOrNull(clothesRequest.shoesId()))
                    .build();
            return codyRepository.save(cody);
        });
    }

    private Clothes getClothesOrNull(Long clothesId) {
        if (clothesId != null) {
            return entityManager.getReference(Clothes.class, clothesId);
        } else {
            return null;
        }
    }

    public void createCodyImage(ClothesRequest clothesRequest, String sseKey) {
        List<Long> clothesIdList = getClothesIdList(clothesRequest);
        List<Clothes> clothesList = clothesRepository.findByClothesIdIn(clothesIdList);

        Map<Category, String> imageMap = clothesList.stream()
                .collect(Collectors.toMap(Clothes::getCategory, Clothes::getImage));

        ClothesImageRequest clothesImageRequest = new ClothesImageRequest(
                imageMap.getOrDefault(Category.TOP, null),
                imageMap.getOrDefault(Category.BOTTOM, null),
                imageMap.getOrDefault(Category.OUTER, null),
                imageMap.getOrDefault(Category.SHOES, null),
                imageMap.getOrDefault(Category.ONEPIECE, null)
        );

        try {
            SseObject sseObject = new SseObject(sseKey, clothesImageRequest);
            rabbitMQUtil.convertAndSend("cody_image_create", "order_direct_exchange", "cody_image_create", sseObject);
        } catch (Exception e) {
            log.error(e.getMessage());
        }
    }

    @NotNull
    private static List<Long> getClothesIdList(ClothesRequest clothesRequest) {
        List<Long> clothesIdList = new ArrayList<>();
        if (clothesRequest.topId() != null) clothesIdList.add(clothesRequest.topId());
        if (clothesRequest.bottomId() != null) clothesIdList.add(clothesRequest.bottomId());
        if (clothesRequest.outerId() != null) clothesIdList.add(clothesRequest.outerId());
        if (clothesRequest.shoesId() != null) clothesIdList.add(clothesRequest.shoesId());
        if (clothesRequest.onepieceId() != null) clothesIdList.add(clothesRequest.onepieceId());
        return clothesIdList;
    }
}
