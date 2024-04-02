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
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
@Slf4j
public class ClothesService {
    private final S3Service s3Service;
    private final ClothesRepository clothesRepository;
    private final RabbitMQUtil rabbitMQUtil;
    private final ClothesTempRepository clothesTempRepository;
    private final  ClosetService closetService;

    private Clothes mappingClothesRequest(ClothesCreateRequest clothesCreateRequest, String url, Long memberId) {
        return Clothes.builder()
                .name(clothesCreateRequest.name())
                .clothesId(clothesCreateRequest.clothesId())
                .price(clothesCreateRequest.price())
                .brand(clothesCreateRequest.brand())
                .color(clothesCreateRequest.color())
                .link(clothesCreateRequest.link())
                .image(url)
                .category(clothesCreateRequest.category())
                .productNo(clothesCreateRequest.productNo())
                .memberId(memberId)
                .build();
    }

    @Transactional
    public Clothes createClothes(ClothesCreateRequest clothesCreateRequest) {
        String url = s3Service.uploadAI(clothesCreateRequest.multipartFile());
        Clothes clothes = mappingClothesRequest(clothesCreateRequest, url, null);
        return clothesRepository.save(clothes);
    }

    @Transactional
    public Clothes createClothesTemp(String uuid, ClothesCreateRequest createRequest, Long memberId) {
        ClothesTemp clothesTemp = clothesTempRepository.findById(uuid)
                .orElseThrow(() -> new NoSuchElementException("해당 UUID를 가진 임시 의류가 존재하지 않습니다: " + uuid));
        String url = s3Service.uploadAI(uuid, Base64.decode(clothesTemp.getImg()));

        Clothes clothes = clothesRepository.save(
                mappingClothesRequest(createRequest, url, memberId));

        closetService.createCloset(clothes.getClothesId(), memberId);
        clothesTempRepository.deleteById(uuid);
        return clothes;
    }

    public void imageConvert(MultipartFile multipartFile, String sseKey) {
        try {
            SseObject sseObject = new SseObject(sseKey, Base64.encodeAsString(multipartFile.getBytes()));
            rabbitMQUtil.convertAndSend("extract_img", "order_direct_exchange", "img_extract_ai", sseObject);
        } catch (Exception e) {
            log.error("이미지 변환 중 에러 발생", e);
        }
    }

    public byte[] getTempImg(String uuid) {
        return Base64.decode(clothesTempRepository.findById(uuid)
                .orElseThrow(() -> new NoSuchElementException("해당 UUID를 가진 임시 이미지가 존재하지 않습니다: " + uuid)).getImg());
    }

    public List<Clothes> findClothesListIn(List<Long> clothesIdList) {
        return clothesRepository.findByClothesIdIn(clothesIdList);
    }

    public List<Clothes> findClothesTempList(String uuid) {
        ClothesTemp clothesTemp = clothesTempRepository.findById(uuid)
                .orElseThrow(() -> new NoSuchElementException("해당 UUID를 가진 임시 리스트가 존재하지 않습니다: " + uuid));
        return findClothesListIn(clothesTemp.getList());
    }

    public List<Clothes> findClothesListByProductNo(String productNo) {
        return clothesRepository.findByProductNo(productNo);
    }

    @Transactional
    public void deleteClothes(Long clothesId) {
        clothesRepository.deleteById(clothesId);
    }
}
