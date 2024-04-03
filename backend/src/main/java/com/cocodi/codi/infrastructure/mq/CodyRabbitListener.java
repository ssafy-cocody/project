package com.cocodi.codi.infrastructure.mq;

import com.amazonaws.util.Base64;
import com.cocodi.aws.application.service.S3Service;
import com.cocodi.clothes.domain.model.Category;
import com.cocodi.clothes.domain.model.Clothes;
import com.cocodi.clothes.domain.repository.ClothesRepository;
import com.cocodi.clothes.presentation.request.ClothesImageRequest;
import com.cocodi.clothes.presentation.request.ClothesListRequest;
import com.cocodi.clothes.presentation.request.ClothesPythonRequest;
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
import com.cocodi.codi.presentation.response.RecommendItemResponse;
import com.cocodi.common.infrastructure.rabbit.annotation.RabbitMQDirectListener;
import com.cocodi.common.infrastructure.rabbit.annotation.RabbitMQListenerEnable;
import com.cocodi.common.infrastructure.rabbit.util.RabbitMQUtil;
import com.cocodi.member.domain.model.Member;
import com.cocodi.member.domain.repository.MemberRepository;
import com.cocodi.member.infrastructure.exception.MemberFindException;
import com.cocodi.sse.application.service.SseService;
import com.cocodi.sse.domain.model.SseObject;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
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
    private final MyCodyRepository myCodyRepository;
    private final S3Service s3Service;
    private final RedisTemplate<String, String> redisTemplate;
    private final RabbitMQUtil rabbitMQUtil;
    private final ObjectMapper objectMapper;

    @RabbitMQDirectListener(name = "cody_image_create", isolatedQueue = true, lazy = true)
    public void makeImage(SseObject sseObject) {
        HashMap<?, ?> hashMap = (HashMap<?, ?>) sseObject.data();
        List<String> image = (List<String>) hashMap.get("img");

        String findCodyListString = redisTemplate.opsForValue().get("findCody:" + sseObject.sseId());
        List<FindCodyImageRequest> findCodyImageRequests;
        if (findCodyListString != null) {
            findCodyImageRequests = objectMapper.convertValue(findCodyListString, new TypeReference<>() {
            });
        } else {
            findCodyImageRequests = new ArrayList<>();
        }

        for (String img : image) {
            byte[] imageBytes = Base64.decode(img);
            String uploadImageUrl = s3Service.uploadAI(UUID.randomUUID().toString(), imageBytes);
            String stringId = redisTemplate.opsForValue().get("cody:" + sseObject.sseId());
            if (stringId == null) {
                throw new RuntimeException("id 조회 실패");
            }
            Long codyId = Long.parseLong(stringId);
            Cody cody = codyRepository.findById(codyId).orElseThrow(() -> new RuntimeException("cody 조회 실패"));
            cody.setImage(uploadImageUrl);
            codyRepository.save(cody);
            findCodyImageRequests.add(new FindCodyImageRequest(codyId, cody.getImage()));
        }

        String codyItem = redisTemplate.opsForValue().get("codyItem:" + sseObject.sseId());
        isCodyItem(sseObject, codyItem, findCodyImageRequests);

        String alreadyFindCody = redisTemplate.opsForValue().get("alreadyFindCody:" + sseObject.sseId());
        isAlreadyFindCody(sseObject, alreadyFindCody, findCodyImageRequests);

    }

    private void isAlreadyFindCody(SseObject sseObject, String alreadyFindCody, List<FindCodyImageRequest> findCodyImageRequests) {
        if (alreadyFindCody != null) {
            StringTokenizer st = new StringTokenizer(alreadyFindCody);
            Long memberId = Long.parseLong(st.nextToken());
            String dateStr = st.nextToken();
            LocalDate date = LocalDate.parse(dateStr);


            // 코디 이미지 생성 후 받아와서 처리
            Member member = memberRepository.findById(memberId)
                    .orElseThrow(() -> new MemberFindException("Cannot find Member"));

            Ootd ootd = ootdRepository.findByMemberAndDate(member, date).orElse(null);

            List<RecommendCodyResponse> recommendCodyResponses = new ArrayList<>();

            IntStream.range(0, findCodyImageRequests.size())
                    .forEach(i -> {
                        FindCodyImageRequest findCodyImageRequest = findCodyImageRequests.get(i);
                        Long codyId = findCodyImageRequest.codyId();
                        boolean isMyOotd = ootd != null && Objects.equals(ootd.getCody().getCodiId(), codyId);
                        recommendCodyResponses.add(
                                new RecommendCodyResponse(
                                        findCodyImageRequest.codyId(),
                                        isMyCody(member, codyId),
                                        isMyOotd,
                                        findCodyImageRequest.image()
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
    }

    private void isCodyItem(SseObject sseObject, String codyItem, List<FindCodyImageRequest> findCodyImageRequests) {
        if (codyItem != null) {
            Long recommend = getaLong(codyItem);
            Clothes clothes = clothesRepository.findById(recommend).orElseThrow(() -> new RuntimeException("옷 조회 실패"));
            FindCodyImageRequest findCodyImageRequest = findCodyImageRequests.get(0);
            RecommendItemResponse recommendItemResponse = new RecommendItemResponse(findCodyImageRequest.codyId(), findCodyImageRequest.image(), clothes.getImage(), clothes.getLink());
            try {
                String recommendItemResponseString = objectMapper.writeValueAsString(recommendItemResponse);
                sseService.sendMessageAndRemove(sseObject.sseId(), "message", recommendItemResponseString);
            } catch (JsonProcessingException e) {
                log.error("변환 실패");
            }
        }
    }

    private static Long getaLong(String codyItem) {
        StringTokenizer st = new StringTokenizer(codyItem);
        Long codyId = null, recommend = null;
        while (st.hasMoreTokens()) {
            String key = st.nextToken();
            String value = st.nextToken();
            // key가 위의 값들 중 하나일 때 처리
            switch (key) {
                case "codyId" -> codyId = Long.parseLong(value);
                case "recommend" -> recommend = Long.parseLong(value);
            }
        }
        if(recommend == null) {
            throw new RuntimeException("추천 Id 조회 실패");
        }
        return recommend;
    }

    @RabbitMQDirectListener(name = "dhdhxlelzb", isolatedQueue = true, lazy = true)
    public void extractImg(SseObject sseObject) {
        LinkedHashMap<String, List<Long>> data = (LinkedHashMap<String, List<Long>>) sseObject.data();
        List<Long> top = data.get("TOP");
        List<Long> bottom = data.get("BOTTOM");
        List<Long> shoes = data.get("SHOES");
        List<Long> outer = data.get("OUTER");
        List<Long> onepiece = data.get("ONEPIECE");

        ClothesListRequest clothesList = new ClothesListRequest(top, bottom, shoes, outer, onepiece);

        List<Long> allIds = new ArrayList<>();
        addAllIfNotNull(allIds, clothesList.top());
        addAllIfNotNull(allIds, clothesList.bottom());
        addAllIfNotNull(allIds, clothesList.shoes());
        addAllIfNotNull(allIds, clothesList.outer());
        addAllIfNotNull(allIds, clothesList.onepiece());

        List<Clothes> findClothesList = clothesRepository.findByClothesIdIn(allIds);

        ImageSearchResponse imageSearchResponse = createImageSearchResponse(findClothesList);

        try {
            String imageSearchResponseString = objectMapper.writeValueAsString(imageSearchResponse);
            sseService.sendMessageAndRemove(sseObject.sseId(), "message", imageSearchResponseString);
        } catch (JsonProcessingException e) {
            log.error("변환 실패");
        }

    }

    private ImageSearchResponse createImageSearchResponse(List<Clothes> findClothesList) {
        Map<Category, List<ImageResponse>> categoryMap = new HashMap<>();
        categoryMap.put(Category.TOP, new ArrayList<>());
        categoryMap.put(Category.BOTTOM, new ArrayList<>());
        categoryMap.put(Category.SHOES, new ArrayList<>());
        categoryMap.put(Category.OUTER, new ArrayList<>());
        categoryMap.put(Category.ONEPIECE, new ArrayList<>());

        for (Clothes clothes : findClothesList) {
            List<ImageResponse> list = categoryMap.computeIfAbsent(clothes.getCategory(), k -> new ArrayList<>());
            addImageResponse(list, clothes);
        }

        return new ImageSearchResponse(
                categoryMap.get(Category.TOP),
                categoryMap.get(Category.BOTTOM),
                categoryMap.get(Category.SHOES),
                categoryMap.get(Category.OUTER),
                categoryMap.get(Category.ONEPIECE)
        );
    }

    @RabbitMQDirectListener(name = "closet_cody_recommend", isolatedQueue = true, lazy = true)
    public void getRecommendCodyList(SseObject sseObject) {
        log.info("추천받은 코디 리스트 전달 받음");
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
            if (findCody.isEmpty()) {
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

        String sseKey = sseObject.sseId();
        // 날짜, memberId도 받아서 처리해줘야함
        RecommendCodyKey recommendCodyKey = recommendCodyKeyRepository.findBySseKey(sseKey);
        if (recommendCodyKey == null) {
            throw new RuntimeException("recommendCodyKey 조회 실패");
        }
        deleteKeyFromRedis("cody:" + sseKey);

        Long memberId = recommendCodyKey.getMemberId();
        LocalDate date = recommendCodyKey.getDate();

        redisTemplate.opsForValue().set("alreadyFindCody:" + sseObject.sseId(), memberId.toString() + " " + date.toString());

        try {
            redisTemplate.opsForValue().set("findCody:" + sseObject.sseId(), objectMapper.writeValueAsString(findCodyList));
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }

        // 이미지 생성
        SseObject sseObjectImage = new SseObject(sseObject.sseId(), clothesImageListRequest);
        rabbitMQUtil.convertAndSend("cody_image_create", "order_direct_exchange", "cody_image_create", sseObjectImage);

    }

    public boolean isMyCody(Member member, Long codyId) {
        return myCodyRepository.findByMemberAndCodyCodiId(member, codyId).isPresent();
    }

    @RabbitMQDirectListener(name = "recommend_item", isolatedQueue = true, lazy = true)
    public void getRecommendItemList(SseObject sseObject) {
        RecommendItemPythonRequest request = RecommendItemPythonRequest.fromSseObject(sseObject);
        ClothesPythonRequest clothesRequest = request.cody();
        Long recommendId = request.recommend();

        Clothes clothes = clothesRepository.findById(recommendId).orElseThrow(() -> new RuntimeException("clothes find fail"));

        Optional<Cody> findCody = codyRepository.findByTopClothesIdAndBottomClothesIdAndOuterClothesIdAndOnepieceClothesIdAndShoesClothesId(
                clothesRequest.top(), clothesRequest.bottom(), clothesRequest.outer(), clothesRequest.onepiece(), clothesRequest.shoes());
        // cody 가 있을 때는 codyId, Image, 추천받은 옷 Id, Image, 구매 링크를 내려줌
        RecommendItemResponse recommendItemResponse;
        if (findCody.isPresent()) {
            Cody cody = findCody.get();
            recommendItemResponse = new RecommendItemResponse(cody.getCodiId(), cody.getImage(), clothes.getImage(), clothes.getLink());
            try {
                String recommendItemResponseString = objectMapper.writeValueAsString(recommendItemResponse);
                sseService.sendMessageAndRemove(sseObject.sseId(), "message", recommendItemResponseString);
                return;
            } catch (JsonProcessingException e) {
                log.error("변환 실패");
            }
        }
        // 없다면 파이썬에 옷 ID 들을 보내고 image를 받아와서 코디를 등록하고 위와 같이 내려줌
        // 코디 먼저 등록
        Cody cody = Cody.builder()
                .top(clothesRepository.findById(clothesRequest.top()).orElseThrow(() -> new RuntimeException("옷 조회 실패")))
                .bottom(clothesRepository.findById(clothesRequest.bottom()).orElseThrow(() -> new RuntimeException("옷 조회 실패")))
                .outer(clothesRepository.findById(clothesRequest.outer()).orElseThrow(() -> new RuntimeException("옷 조회 실패")))
                .onepiece(clothesRepository.findById(clothesRequest.onepiece()).orElseThrow(() -> new RuntimeException("옷 조회 실패")))
                .shoes(clothesRepository.findById(clothesRequest.shoes()).orElseThrow(() -> new RuntimeException("옷 조회 실패")))
                .build();
        Cody save = codyRepository.save(cody);

        ClothesImageListRequest clothesImageListRequest = getClothesImageListRequest(clothesRequest);

        log.info("추천받은 코디가 없어서 코디 이미지 생성 요청");
        // redis에 넣어놓을 값 옷 ID들, 추천받은 옷 ID
        String result = "codyId " + save.getCodiId();
        result += "recommend " + recommendId;

        redisTemplate.opsForValue().set("codyItem:" + sseObject.sseId(), result);
        SseObject sseObjectImage = new SseObject(sseObject.sseId(), clothesImageListRequest);
        rabbitMQUtil.convertAndSend("cody_image_create", "order_direct_exchange", "cody_image_create", sseObjectImage);

    }

    private static ClothesImageListRequest getClothesImageListRequest(ClothesPythonRequest clothesRequest) {
        List<ClothesImageRequest> clothesImageRequests = new ArrayList<>();
        clothesImageRequests.add(new ClothesImageRequest(
                clothesRequest.top() != null ? clothesRequest.top().toString() : clothesRequest.onepiece().toString(),
                clothesRequest.bottom().toString(),
                clothesRequest.outer().toString(),
                clothesRequest.shoes().toString()
        ));
        return new ClothesImageListRequest(clothesImageRequests);
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