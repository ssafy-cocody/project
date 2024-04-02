package com.cocodi.codi.infrastructure.mq;

import com.amazonaws.util.Base64;
import com.cocodi.aws.application.service.S3Service;
import com.cocodi.clothes.domain.model.Clothes;
import com.cocodi.clothes.domain.repository.ClothesRepository;
import com.cocodi.clothes.presentation.request.ClothesImageRequest;
import com.cocodi.clothes.presentation.request.ClothesListRequest;
import com.cocodi.clothes.presentation.request.ClothesPythonRequest;
import com.cocodi.codi.application.service.CodyService;
import com.cocodi.codi.domain.model.Cody;
import com.cocodi.codi.domain.model.Ootd;
import com.cocodi.codi.domain.model.RecommendCodyKey;
import com.cocodi.codi.domain.repository.CodyRepository;
import com.cocodi.codi.domain.repository.MyCodyRepository;
import com.cocodi.codi.domain.repository.OotdRepository;
import com.cocodi.codi.domain.repository.RecommendCodyKeyRepository;
import com.cocodi.codi.presentation.request.ClothesImageListRequest;
import com.cocodi.codi.presentation.request.FindCodyImageRequest;
import com.cocodi.codi.presentation.request.RecommendItemPythonRequest;
import com.cocodi.codi.presentation.request.RecommendPythonRequest;
import com.cocodi.codi.presentation.response.ImageResponse;
import com.cocodi.codi.presentation.response.ImageSearchResponse;
import com.cocodi.codi.presentation.response.RecommendCodyResponse;
import com.cocodi.common.infrastructure.rabbit.annotation.RabbitMQDirectListener;
import com.cocodi.common.infrastructure.rabbit.annotation.RabbitMQListenerEnable;
import com.cocodi.common.infrastructure.rabbit.util.RabbitMQUtil;
import com.cocodi.member.domain.model.Member;
import com.cocodi.member.domain.repository.MemberRepository;
import com.cocodi.member.infrastructure.exception.MemberFindException;
import com.cocodi.security.domain.model.PrincipalDetails;
import com.cocodi.sse.application.service.SseService;
import com.cocodi.sse.domain.model.SseObject;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.IntStream;

@Component
@Slf4j
@RequiredArgsConstructor
@RabbitMQListenerEnable(domainName = "Cody")
public class CodyRabbitListener {
    private final SseService sseService;
    private final ClothesRepository clothesRepository;
    private final CodyRepository codyRepository;
    private final RecommendCodyKeyRepository recommendCodyKeyRepository;
    private final MemberRepository memberRepository;
    private final OotdRepository ootdRepository;
    private final CodyService codyService;
    private final MyCodyRepository myCodyRepository;
    private final S3Service s3Service;
    private final RedisTemplate<String, String> redisTemplate;
    private final RabbitMQUtil rabbitMQUtil;

    @RabbitMQDirectListener(name = "cody_image_create", isolatedQueue = true, lazy = true)
    public void makeImage(SseObject sseObject) {
        HashMap<?, ?> hashMap = (HashMap<?, ?>) sseObject.data();
        List<String> image = (List<String>) hashMap.get("img");
        for (String img : image) {
            byte[] imageBytes = Base64.decode(img);
            String uploadImageUrl = s3Service.uploadAI(UUID.randomUUID().toString(), imageBytes);
            String stringId = redisTemplate.opsForValue().get("cody:" + sseObject.sseId());
            if(stringId == null) {
                throw new RuntimeException("id 조회 실패");
            }
            Long codyId = Long.parseLong(stringId);
            Cody cody = codyRepository.findById(codyId).orElseThrow(() -> new RuntimeException("cody 조회 실패"));
            cody.setImage(uploadImageUrl);
            codyRepository.save(cody);
        }

    }

    @RabbitMQDirectListener(name = "cody_clothes_search", isolatedQueue = true, lazy = true)
    public void extractImg(SseObject sseObject) {
        HashMap<?, ?> hashMap = (HashMap<?, ?>) sseObject.data();
        ClothesListRequest clothesList = (ClothesListRequest) hashMap.get("data");
        List<Long> allIds = new ArrayList<>();
        addAllIfNotNull(allIds, clothesList.top());
        addAllIfNotNull(allIds, clothesList.bottom());
        addAllIfNotNull(allIds, clothesList.shoes());
        addAllIfNotNull(allIds, clothesList.outer());
        addAllIfNotNull(allIds, clothesList.onepiece());

        List<Clothes> findClothesList = clothesRepository.findByClothesIdIn(allIds);

        ImageSearchResponse imageSearchResponse = createImageSearchResponse(findClothesList);

        ObjectMapper objectMapper = new ObjectMapper();

        try {
            String imageSearchResponseString = objectMapper.writeValueAsString(imageSearchResponse);
            sseService.sendMessageAndRemove(sseObject.sseId(), "message", imageSearchResponseString);
        } catch (JsonProcessingException e) {
            log.error("변환 실패");
        }
    }

    private ImageSearchResponse createImageSearchResponse(List<Clothes> findClothesList) {
        List<ImageResponse> topList = new ArrayList<>();
        List<ImageResponse> bottomList = new ArrayList<>();
        List<ImageResponse> shoesList = new ArrayList<>();
        List<ImageResponse> outerList = new ArrayList<>();
        List<ImageResponse> onepieceList = new ArrayList<>();

        for (Clothes clothes : findClothesList) {
            switch (clothes.getCategory()) {
                case TOP:
                    addImageResponse(topList, clothes);
                    break;
                case BOTTOM:
                    addImageResponse(bottomList, clothes);
                    break;
                case SHOES:
                    addImageResponse(shoesList, clothes);
                    break;
                case OUTER:
                    addImageResponse(outerList, clothes);
                    break;
                case ONEPIECE:
                    addImageResponse(onepieceList, clothes);
                    break;
            }
        }

        return new ImageSearchResponse(topList, bottomList, shoesList, outerList, onepieceList);
    }

    @RabbitMQDirectListener(name = "closet_cody_recommend", isolatedQueue = true, lazy = true)
    public void getRecommendCodyList(SseObject sseObject, @AuthenticationPrincipal PrincipalDetails principalDetails) {
        HashMap<?, ?> hashMap = (HashMap<?, ?>) sseObject.data();
        RecommendPythonRequest request = (RecommendPythonRequest) hashMap.get("codies");
        List<ClothesPythonRequest> clothesRequests = request.codies();

        // 코디가 존재하는 것들과 없는 것들끼리 따라 모아놔
        // 있는 것들은 redis 에 넣어놓고 없는 것들은 이미지 생성하는걸로 보내
        List<ClothesImageRequest> clothesImageRequests = new ArrayList<>();

        List<FindCodyImageRequest> findCodyList = new ArrayList<>();

        ClothesImageListRequest clothesImageListRequest = new ClothesImageListRequest(clothesImageRequests);
        for (ClothesPythonRequest clothesRequest : clothesRequests) {
            Optional<Cody> findCody = codyRepository.findByTopClothesIdAndBottomClothesIdAndOuterClothesIdAndOnepieceClothesIdAndShoesClothesId(
                    clothesRequest.top(), clothesRequest.bottom(), clothesRequest.outer(), clothesRequest.onepiece(), clothesRequest.shoes()
            );
            if(findCody.isEmpty()) {
                clothesImageRequests.add(new ClothesImageRequest(
                        clothesRequest.top() != null ? clothesRequest.top().toString() : clothesRequest.onepiece().toString(),
                        clothesRequest.bottom().toString(),
                        clothesRequest.outer().toString(),
                        clothesRequest.shoes().toString()
                ));
            } else {
                Cody cody = findCody.get();
                findCodyList.add(new FindCodyImageRequest(cody.getCodiId(), cody.getImage()));
            }
        }

        ObjectMapper objectMapper = new ObjectMapper();

        try {
            redisTemplate.opsForValue().set("findCody:" + sseObject.sseId(), objectMapper.writeValueAsString(findCodyList));
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }

        // 이미지 생성
        SseObject sseObjectImage = new SseObject(sseService.createInstance(), clothesImageListRequest);
        rabbitMQUtil.convertAndSend("cody_image_create", "order_direct_exchange", "cody_image_create", sseObjectImage);































        String sseKey = sseObject.sseId();
        // todo : 날짜, memberId도 받아서 처리해줘야함
        RecommendCodyKey recommendCodyKey = recommendCodyKeyRepository.findBySseKey(sseKey);
        if (recommendCodyKey == null) {
            throw new RuntimeException("recommendCodyKey 조회 실패");
        }
        Long memberId = recommendCodyKey.getMemberId();
        LocalDate date = recommendCodyKey.getDate();
        // todo : 코디 이미지 생성 후 받아와서 처리
        List<String> codyImages = new ArrayList<>();

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberFindException("Cannot find Member"));

        Ootd ootd = ootdRepository.findByMemberAndDate(member, date).orElse(null);

        List<RecommendCodyResponse> recommendCodyResponses = new ArrayList<>();
        IntStream.range(0, clothesRequests.size())
                .forEach(i -> {
                    ClothesPythonRequest clothesRequest = clothesRequests.get(i);
                    String codyImage = codyImages.get(i);
                    Cody cody = codyService.getCodyFromRequest(clothesRequest, codyImage);
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


        try {
            String recommendCodyResponsesString = objectMapper.writeValueAsString(recommendCodyResponses);
            sseService.sendMessageAndRemove(sseObject.sseId(), "message", recommendCodyResponsesString);
        } catch (JsonProcessingException e) {
            log.error("변환 실패");
        }
    }

    public boolean isMyCody(Member member, Cody cody) {
        return myCodyRepository.findByMemberAndCody(member, cody).isPresent();
    }

    @RabbitMQDirectListener(name = "recommend_item", isolatedQueue = true, lazy = true)
    public void getRecommendItemList(SseObject sseObject, @AuthenticationPrincipal PrincipalDetails principalDetails) {
        HashMap<?, ?> hashMap = (HashMap<?, ?>) sseObject.data();
        // 파이썬에서 추천 아이템 clothesId, 코디 clothesId 1개 받아오기
        RecommendItemPythonRequest request = (RecommendItemPythonRequest) hashMap.get("data");
        ClothesPythonRequest clothesRequest = request.cody();

        Optional<Cody> findCody = codyRepository.findByTopClothesIdAndBottomClothesIdAndOuterClothesIdAndOnepieceClothesIdAndShoesClothesId(clothesRequest.top(), clothesRequest.bottom(), clothesRequest.outer(), clothesRequest.onepiece(), clothesRequest.shoes());
        // todo : cody가 있을 때는 codyId, Image, 추천받은 옷 Id, Image, 구매 링크를 내려줌
        if (findCody.isPresent()) {

        }
        // todo : 없다면 파이썬에 옷 ID 들을 보내고 image를 받아와서 코디를 등록하고 위와 같이 내려줌

        ObjectMapper objectMapper = new ObjectMapper();

//        try {
//            String imageSearchResponseString = objectMapper.writeValueAsString(imageSearchResponse);
//            sseService.sendMessageAndRemove(sseObject.sseId(), "message", imageSearchResponseString);
//        } catch (JsonProcessingException e) {
//            log.error("변환 실패");
//        }
        // todo

    }

    private void addImageResponse(List<ImageResponse> imageList, Clothes clothes) {
        imageList.add(new ImageResponse(clothes.getClothesId(), clothes.getImage()));
    }

    private void addAllIfNotNull(List<Long> allIds, List<Long> clothesIds) {
        if (clothesIds != null) {
            allIds.addAll(clothesIds);
        }
    }

    public void deleteKeyFromRedis(String sseKey) {
        RecommendCodyKey recommendCodyKey = recommendCodyKeyRepository.findBySseKey(sseKey);
        if (recommendCodyKey != null) {
            recommendCodyKeyRepository.delete(recommendCodyKey);
        }
    }
}