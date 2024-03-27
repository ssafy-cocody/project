package com.cocodi.clothes.application.service;

import com.amazonaws.util.Base64;
import com.cocodi.aws.application.service.S3Service;
import com.cocodi.clothes.domain.model.Clothes;
import com.cocodi.clothes.domain.model.ClothesTemp;
import com.cocodi.clothes.domain.repository.ClothesRepository;
import com.cocodi.clothes.domain.repository.ClothesTempRepository;
import com.cocodi.clothes.presentation.request.ClothesCreateRequest;
import com.cocodi.common.infrastructure.rabbit.util.RabbitMQUtil;
import com.cocodi.sse.domain.model.SseObject;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
@Service
@RequiredArgsConstructor
@Slf4j
public class ClothesService {
    private final S3Service s3Service;
    private final ClothesRepository clothesRepository;
    private final RabbitMQUtil rabbitMQUtil;
    private final ClothesTempRepository clothesTempRepository;

    @Transactional
    public Clothes createClothes(ClothesCreateRequest clothesCreateRequest) {
        String url = s3Service.uploadAI(clothesCreateRequest.multipartFile());
        Clothes clothes = Clothes.builder()
                .name(clothesCreateRequest.name())
                .clothesId(clothesCreateRequest.clothesId())
                .price(clothesCreateRequest.price())
                .brand(clothesCreateRequest.brand())
                .color(clothesCreateRequest.color())
                .link(clothesCreateRequest.link())
                .image(url)
                .category(clothesCreateRequest.category())
                .productNo(clothesCreateRequest.productNo())
                .build();
        return clothesRepository.save(clothes);
    }

    public void imageConvert(MultipartFile multipartFile, String sseKey) {
        try {
            SseObject sseObject = new SseObject(sseKey, Base64.encodeAsString(multipartFile.getBytes()));
            rabbitMQUtil.convertAndSend("extract_img", "order_direct_exchange", "img_extract_ai", sseObject);
        } catch (Exception e) {
            log.info(e.getMessage());
        }
    }

    public byte[] getTempImg(String uuid) {
        return Base64.decode(clothesTempRepository.findById(uuid).orElseThrow().getImg());
    }

    public List<Clothes> findClothesListIn(List<Long> clothesIdList) {
        return clothesRepository.findByClothesIdIn(clothesIdList);
    }

    public List<Clothes> findClothesTempList(String uuid) {
        ClothesTemp clothesTemp = clothesTempRepository.findById(uuid).orElseThrow();

        return findClothesListIn(clothesTemp.getList());
    }

    public void createClothesTemp(String uuid, ClothesCreateRequest clothesCreateRequest) {
    }
}
