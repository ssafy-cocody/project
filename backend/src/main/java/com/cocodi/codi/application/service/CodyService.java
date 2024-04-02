package com.cocodi.codi.application.service;

import com.cocodi.clothes.domain.model.Category;
import com.cocodi.clothes.domain.model.Clothes;
import com.cocodi.clothes.domain.repository.ClothesRepository;
import com.cocodi.clothes.presentation.request.ClothesImageRequest;
import com.cocodi.clothes.presentation.request.ClothesPythonRequest;
import com.cocodi.codi.domain.model.Cody;
import com.cocodi.codi.domain.model.MyCody;
import com.cocodi.codi.domain.model.RecommendCodyKey;
import com.cocodi.codi.domain.repository.CodyRepository;
import com.cocodi.codi.domain.repository.MyCodyRepository;
import com.cocodi.codi.domain.repository.OotdRepository;
import com.cocodi.codi.domain.repository.RecommendCodyKeyRepository;
import com.cocodi.codi.presentation.request.ClothesImageListRequest;
import com.cocodi.codi.presentation.request.CodyCreateRequest;
import com.cocodi.codi.presentation.request.RecommendCodyRequest;
import com.cocodi.codi.presentation.request.RecommendItemRequest;
import com.cocodi.codi.presentation.response.CodyResponse;
import com.cocodi.common.infrastructure.rabbit.util.RabbitMQUtil;
import com.cocodi.member.domain.enums.Gender;
import com.cocodi.member.domain.model.Member;
import com.cocodi.member.domain.repository.MemberRepository;
import com.cocodi.member.infrastructure.exception.MemberFindException;
import com.cocodi.sse.domain.model.SseObject;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

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
    private final RecommendCodyKeyRepository recommendCodyKeyRepository;
    private final RedisTemplate<String, String> redisTemplate;

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

    public boolean createCody(CodyCreateRequest codyCreateRequest, Long memberId, String sseKey) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberFindException("Cannot find Member"));
        Cody cody = getCodyFromRequest(codyCreateRequest.clothesPythonRequest(), null);
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
        saveCodyIdToRedis(sseKey, cody.getCodiId().toString());
        return true;
    }

    public void deleteMyCody(Long myCodyId, Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberFindException("Cannot find Member"));
        MyCody myCody = myCodyRepository.findByMemberAndMyCodiId(member, myCodyId)
                .orElseThrow(() -> new RuntimeException("Cannot find MyCody"));
        myCodyRepository.delete(myCody);
    }

    public Cody getCodyFromRequest(ClothesPythonRequest clothesRequest, String codyImage) {
        return codyRepository.findByTopClothesIdAndBottomClothesIdAndOuterClothesIdAndOnepieceClothesIdAndShoesClothesId(
                clothesRequest.top(),
                clothesRequest.bottom(),
                clothesRequest.outer(),
                clothesRequest.onepiece(),
                clothesRequest.shoes()
        ).orElseGet(() -> {
            Cody cody = Cody.builder()
                    .image(codyImage)
                    .top(getClothesOrNull(clothesRequest.top()))
                    .bottom(getClothesOrNull(clothesRequest.bottom()))
                    .outer(getClothesOrNull(clothesRequest.outer()))
                    .onepiece(getClothesOrNull(clothesRequest.onepiece()))
                    .shoes(getClothesOrNull(clothesRequest.shoes()))
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

    public void createCodyImage(ClothesPythonRequest clothesPythonRequest, String sseKey) {
        List<Long> clothesIdList = getClothesIdList(clothesPythonRequest);
        List<Clothes> clothesList = clothesRepository.findByClothesIdIn(clothesIdList);

        Map<Category, String> imageMap = clothesList.stream()
                .collect(Collectors.toMap(Clothes::getCategory, Clothes::getImage));

        String topImage = imageMap.get(Category.TOP);
        String onePieceImage = imageMap.get(Category.ONEPIECE);

        ClothesImageRequest clothesImageRequest = new ClothesImageRequest(
                topImage != null ? topImage : onePieceImage,
                imageMap.getOrDefault(Category.BOTTOM, null),
                imageMap.getOrDefault(Category.OUTER, null),
                imageMap.getOrDefault(Category.SHOES, null)
        );
        List<ClothesImageRequest> clothesImageRequests = new ArrayList<>();
        clothesImageRequests.add(clothesImageRequest);
        ClothesImageListRequest clothesImageListRequest = new ClothesImageListRequest(clothesImageRequests);

        try {
            SseObject sseObject = new SseObject(sseKey, clothesImageListRequest);
            rabbitMQUtil.convertAndSend("cody_image_create", "order_direct_exchange", "cody_image_create", sseObject);
        } catch (Exception e) {
            log.error(e.getMessage());
        }
    }

    @NotNull
    private static List<Long> getClothesIdList(ClothesPythonRequest clothesRequest) {
        List<Long> clothesIdList = new ArrayList<>();
        if (clothesRequest.top() != null) clothesIdList.add(clothesRequest.top());
        if (clothesRequest.bottom() != null) clothesIdList.add(clothesRequest.bottom());
        if (clothesRequest.outer() != null) clothesIdList.add(clothesRequest.outer());
        if (clothesRequest.shoes() != null) clothesIdList.add(clothesRequest.shoes());
        if (clothesRequest.onepiece() != null) clothesIdList.add(clothesRequest.onepiece());
        return clothesIdList;
    }

    public void getRecommendCodyList(Integer temp, List<Long> memberCloset, String sseKey) {
        RecommendCodyRequest request =
                new RecommendCodyRequest(memberCloset, temp, 6);

        try {
            SseObject sseObject = new SseObject(sseKey, request);
            rabbitMQUtil.convertAndSend("closet_cody_recommend", "order_direct_exchange", "closet_cody_recommend", sseObject);
        } catch (Exception e) {
            log.error(e.getMessage());
        }


    }

    public void getRecommendItemList(List<Long> memberCloset, Long memberId, Integer temp, String sseKey) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberFindException("Cannot find Member"));
        String gender;
        if (member.getGender() == Gender.FEMALE) {
            gender = "여자";
        } else {
            gender = "남자";
        }
        RecommendItemRequest request =
                new RecommendItemRequest(memberCloset, gender, temp);

        try {
            SseObject sseObject = new SseObject(sseKey, request);
            rabbitMQUtil.convertAndSend("recommend_item", "order_direct_exchange", "recommend_item", sseObject);
        } catch (Exception e) {
            log.error(e.getMessage());
        }

    }

    public void saveIdAndDate(Long memberId, LocalDate date, String sseKey) {
        RecommendCodyKey recommendCodyKey = new RecommendCodyKey(sseKey, memberId, date);
        recommendCodyKeyRepository.save(recommendCodyKey);
    }

    public void saveCodyIdToRedis(String sseKey, String codyId) {
        // Redis에 Cody ID를 String 값으로 저장
        redisTemplate.opsForValue().set("cody:" + sseKey, codyId);
    }

}
