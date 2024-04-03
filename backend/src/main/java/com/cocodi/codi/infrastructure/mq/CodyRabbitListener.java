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
        List<Integer> codyIds = (List<Integer>) hashMap.get("codyId");

        String findCodyListString = redisTemplate.opsForValue().get("findCody:" + sseObject.sseId());
        List<FindCodyImageRequest> findCodyImageRequests;
        if (findCodyListString != null) {
            try {
                findCodyImageRequests = objectMapper.readValue(findCodyListString, new TypeReference<>() {
                });
            } catch (JsonProcessingException e) {
                throw new RuntimeException("변환 오류");
            }

        } else {
            findCodyImageRequests = new ArrayList<>();
        }
        String stringCodyId = redisTemplate.opsForValue().get("cody:" + sseObject.sseId());
        makeImageDefault(stringCodyId, image, findCodyImageRequests);

        String codyItem = redisTemplate.opsForValue().get("codyItem:" + sseObject.sseId());
        isCodyItem(sseObject, codyItem, image, codyIds);

        String alreadyFindCody = redisTemplate.opsForValue().get("alreadyFindCody:" + sseObject.sseId());
        isAlreadyFindCody(sseObject, alreadyFindCody, image, codyIds, findCodyImageRequests);

    }

    private void makeImageDefault(String stringCodyId, List<String> image, List<FindCodyImageRequest> findCodyImageRequests) {
        if (stringCodyId != null) {
            for (String img : image) {
                byte[] imageBytes = Base64.decode(img);
                String uploadImageUrl = s3Service.uploadAI(UUID.randomUUID().toString(), imageBytes);
                Long codyId = Long.parseLong(stringCodyId);
                Cody cody = codyRepository.findById(codyId).orElseThrow(() -> new RuntimeException("cody 조회 실패"));
                cody.setImage(uploadImageUrl);
                codyRepository.save(cody);
                findCodyImageRequests.add(new FindCodyImageRequest(codyId, cody.getImage()));
            }
        }
    }

    private void isAlreadyFindCody(SseObject sseObject, String alreadyFindCody, List<String> image, List<Integer> codyIds, List<FindCodyImageRequest> findCodyImageRequests) {
        if (alreadyFindCody != null) {
            StringTokenizer st = new StringTokenizer(alreadyFindCody);
            Long memberId = Long.parseLong(st.nextToken());
            String dateStr = st.nextToken();
            LocalDate date = LocalDate.parse(dateStr);

            // 코디 이미지 생성 후 받아와서 처리
            Member member = memberRepository.findById(memberId)
                    .orElseThrow(() -> new MemberFindException("Cannot find Member"));

            Ootd ootd = ootdRepository.findByMemberAndDate(member, date).orElse(null);

            IntStream.range(0, image.size())
                    .forEach(i -> {
                        String uploadImageUrl = s3Service.uploadAI(UUID.randomUUID().toString(), Base64.decode(image.get(i)));
                        Optional<Cody> byId = codyRepository.findById(codyIds.get(i).longValue());
                        byId.get().setImage(uploadImageUrl);
                        codyRepository.save(byId.get());
                        findCodyImageRequests.add(new FindCodyImageRequest(codyIds.get(i).longValue(), uploadImageUrl));
                    });

            HashMap<Long, RecommendCodyResponse> recommendCodyResponses = new HashMap<>();

            IntStream.range(0, findCodyImageRequests.size())
                    .forEach(i -> {
                        FindCodyImageRequest findCodyImageRequest = findCodyImageRequests.get(i);
                        Long codyId = findCodyImageRequest.codyId();
                        boolean isMyOotd = ootd != null && Objects.equals(ootd.getCody().getCodiId(), codyId);
                        recommendCodyResponses.put(
                                findCodyImageRequest.codyId(),
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

    private void isCodyItem(SseObject sseObject, String codyItem, List<String> image, List<Integer> codyIds) {
        if (codyItem != null) {
            Long recommend = getaLong(codyItem);
            Clothes clothes = clothesRepository.findById(recommend).orElseThrow(() -> new RuntimeException("옷 조회 실패"));
            String imageUrl = image.get(0);
            byte[] imageBytes = Base64.decode(imageUrl);
            String uploadImageUrl = s3Service.uploadAI(UUID.randomUUID().toString(), imageBytes);
            Long codyId = codyIds.get(0).longValue();
            Cody cody = codyRepository.findById(codyId).orElseThrow(() -> new RuntimeException("옷 못찾음"));
            cody.setImage(uploadImageUrl);
            codyRepository.save(cody);
            RecommendItemResponse recommendItemResponse = new RecommendItemResponse(codyId, uploadImageUrl, clothes.getImage(), clothes.getLink());
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
        if (recommend == null) {
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
        // SseObject에서 data 필드를 추출
        Map<String, Object> data = (Map<String, Object>) sseObject.data();
        // "codies" 키에 해당하는 값 추출
        List<Map<String, Integer>> codies = (List<Map<String, Integer>>) data.get("codies");
        // ClothesPythonRequest 객체의 리스트로 변환
        List<ClothesPythonRequest> clothesPythonRequests = convertToClothesPythonRequests(codies);

        // 코디가 존재하는 것들과 없는 것들끼리 따라 모아놔
        // 있는 것들은 redis 에 넣어놓고 없는 것들은 이미지 생성하는걸로 보내
        List<ClothesImageRequest> clothesImageRequests = new ArrayList<>();

        List<FindCodyImageRequest> findCodyList = new ArrayList<>();

        ClothesImageListRequest clothesImageListRequest = new ClothesImageListRequest(clothesImageRequests);
        for (ClothesPythonRequest clothesRequest : clothesPythonRequests) {
            Optional<Cody> findCody = codyRepository.findByTopClothesIdAndBottomClothesIdAndOuterClothesIdAndOnepieceClothesIdAndShoesClothesId(
                    clothesRequest.top(), clothesRequest.bottom(), clothesRequest.outer(), clothesRequest.onepiece(), clothesRequest.shoes()
            );
            if (findCody.isEmpty()) {
                Cody cody = createCody(clothesRequest);
                Cody save = codyRepository.save(cody);
                clothesImageRequests.add(new ClothesImageRequest(
                        clothesRequest.top() != null ? clothesRepository.findById(clothesRequest.top()).get().getImage() : clothesRepository.findById(clothesRequest.onepiece()).get().getImage(),
                        clothesRequest.bottom() == null ? null : clothesRepository.findById(clothesRequest.bottom()).get().getImage(),
                        clothesRequest.outer() == null ? null : clothesRepository.findById(clothesRequest.outer()).get().getImage(),
                        clothesRequest.shoes() == null ? null : clothesRepository.findById(clothesRequest.shoes()).get().getImage(),
                        save.getCodiId()
                ));
            } else if (findCody.get().getImage() != null) {
                findCodyList.add(new FindCodyImageRequest(findCody.get().getCodiId(), findCody.get().getImage()));
            } else {
                clothesImageRequests.add(new ClothesImageRequest(
                        clothesRequest.top() != null ? clothesRepository.findById(clothesRequest.top()).get().getImage() : clothesRepository.findById(clothesRequest.onepiece()).get().getImage(),
                        clothesRequest.bottom() == null ? null : clothesRepository.findById(clothesRequest.bottom()).get().getImage(),
                        clothesRequest.outer() == null ? null : clothesRepository.findById(clothesRequest.outer()).get().getImage(),
                        clothesRequest.shoes() == null ? null : clothesRepository.findById(clothesRequest.shoes()).get().getImage(),
                        findCody.get().getCodiId()
                ));
            }
        }

        String sseKey = sseObject.sseId();
        // 날짜, memberId도 받아서 처리해줘야함
        String idAndDate = redisTemplate.opsForValue().get("idAndDate:" + sseKey);
        if (idAndDate == null) {
            throw new RuntimeException("recommendCodyKey 조회 실패");
        }
//        deleteKeyFromRedis("cody:" + sseKey);
        StringTokenizer st = new StringTokenizer(idAndDate);

        Long memberId = Long.parseLong(st.nextToken());
        LocalDate date = LocalDate.parse(st.nextToken());

        redisTemplate.opsForValue().set("alreadyFindCody:" + sseObject.sseId(), memberId + " " + date);

        try {
            redisTemplate.opsForValue().set("findCody:" + sseObject.sseId(), objectMapper.writeValueAsString(findCodyList));
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }

        // 이미지 생성
        SseObject sseObjectImage = new SseObject(sseObject.sseId(), clothesImageListRequest);
        rabbitMQUtil.convertAndSend("cody_image_create", "order_direct_exchange", "cody_image_create", sseObjectImage);

    }

    private Cody createCody(ClothesPythonRequest clothesRequest) {
        return Cody.builder()
                .top(clothesRepository.findById(clothesRequest.top() == null ? 0L : clothesRequest.top()).orElse(null))
                .bottom(clothesRepository.findById(clothesRequest.bottom() == null ? 0L : clothesRequest.bottom()).orElse(null))
                .outer(clothesRepository.findById(clothesRequest.outer() == null ? 0L : clothesRequest.outer()).orElse(null))
                .onepiece(clothesRepository.findById(clothesRequest.onepiece() == null ? 0L : clothesRequest.onepiece()).orElse(null))
                .shoes(clothesRepository.findById(clothesRequest.shoes() == null ? 0L : clothesRequest.shoes()).orElse(null))
                .build();
    }

    private Long convertLongFromMap(String key, Map<String, Integer> data) {
        return data.getOrDefault(key, null) == null ? null : data.get(key).longValue();
    }

    private List<ClothesPythonRequest> convertToClothesPythonRequests(List<Map<String, Integer>> codies) {
        List<ClothesPythonRequest> clothesPythonRequests = new ArrayList<>();

        for (Map<String, Integer> cody : codies) {
            Long top = convertLongFromMap("top", cody);
            Long bottom = convertLongFromMap("bottom", cody);
            Long outer = convertLongFromMap("outer", cody);
            Long shoes = convertLongFromMap("shoes", cody);
            Long onepiece = convertLongFromMap("onepiece", cody);

            ClothesPythonRequest clothesPythonRequest = new ClothesPythonRequest(top, bottom, outer, shoes, onepiece);
            clothesPythonRequests.add(clothesPythonRequest);
        }

        return clothesPythonRequests;
    }

    public boolean isMyCody(Member member, Long codyId) {
        return myCodyRepository.findByMemberAndCodyCodiId(member, codyId).isPresent();
    }

    @RabbitMQDirectListener(name = "recommend_item", isolatedQueue = true, lazy = true)
    public void getRecommendItemList(SseObject sseObject) {
        RecommendItemPythonRequest request = RecommendItemPythonRequest.fromSseObject(sseObject);
        ClothesPythonRequest clothesRequest = request.cody();
        Long recommendId = request.recommend();

        //
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
        Cody cody = createCody(clothesRequest);
        Cody save = codyRepository.save(cody);

        ClothesImageListRequest clothesImageListRequest = getClothesImageListRequest(clothesRequest, save.getCodiId());

        log.info("추천받은 코디가 없어서 코디 이미지 생성 요청");
        // redis에 넣어놓을 값 옷 ID들, 추천받은 옷 ID
        String result = "codyId " + save.getCodiId();
        result += " recommend " + recommendId;

        redisTemplate.opsForValue().set("codyItem:" + sseObject.sseId(), result);
        SseObject sseObjectImage = new SseObject(sseObject.sseId(), clothesImageListRequest);
        rabbitMQUtil.convertAndSend("cody_image_create", "order_direct_exchange", "cody_image_create", sseObjectImage);

    }

    private ClothesImageListRequest getClothesImageListRequest(ClothesPythonRequest clothesRequest, Long codiId) {
        List<ClothesImageRequest> clothesImageRequests = new ArrayList<>();
        clothesImageRequests.add(new ClothesImageRequest(
                clothesRequest.top() != null ? clothesRepository.findById(clothesRequest.top()).get().getImage() : clothesRepository.findById(clothesRequest.onepiece()).get().getImage(),
                clothesRequest.bottom() == null ? null : clothesRepository.findById(clothesRequest.bottom()).get().getImage(),
                clothesRequest.outer() == null ? null : clothesRepository.findById(clothesRequest.outer()).get().getImage(),
                clothesRequest.shoes() == null ? null : clothesRepository.findById(clothesRequest.shoes()).get().getImage(),
                codiId
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