package com.cocodi.codi.infrastructure.mq;

import com.cocodi.clothes.domain.model.Clothes;
import com.cocodi.clothes.domain.repository.ClothesRepository;
import com.cocodi.clothes.domain.repository.ClothesTempRepository;
import com.cocodi.codi.presentation.request.ClothesListRequest;
import com.cocodi.codi.presentation.response.ImageResponse;
import com.cocodi.codi.presentation.response.ImageSearchResponse;
import com.cocodi.common.infrastructure.rabbit.annotation.RabbitMQDirectListener;
import com.cocodi.common.infrastructure.rabbit.annotation.RabbitMQListenerEnable;
import com.cocodi.sse.application.service.SseService;
import com.cocodi.sse.domain.model.SseObject;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Component
@Slf4j
@RequiredArgsConstructor
@RabbitMQListenerEnable(domainName = "Cody")
public class CodyRabbitListener {
    private final SseService sseService;
    private final ClothesTempRepository clothesTempRepository;
    private final ClothesRepository clothesRepository;

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

    private void addImageResponse(List<ImageResponse> imageList, Clothes clothes) {
        imageList.add(new ImageResponse(clothes.getClothesId(), clothes.getImage()));
    }

    private void addAllIfNotNull(List<Long> allIds, List<Long> clothesIds) {
        if (clothesIds != null) {
            allIds.addAll(clothesIds);
        }
    }
}