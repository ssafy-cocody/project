package com.cocodi.clothes.application.service;

import com.cocodi.aws.application.service.S3Service;
import com.cocodi.clothes.domain.model.Clothes;
import com.cocodi.clothes.domain.repository.ClothesRepository;
import com.cocodi.clothes.presentation.request.ClothesCreateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ClothesService {
    private final S3Service s3Service;
    private final ClothesRepository clothesRepository;

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
}
