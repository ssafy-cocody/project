package com.cocodi.clothes.presentation.request;

import com.cocodi.clothes.domain.model.Category;
import com.cocodi.clothes.domain.model.Color;
import org.springframework.web.multipart.MultipartFile;

public record ClothesCreateRequest(
        Long clothesId,

        Category category,

        String name,

        Color color,

        String brand,

        String productNo,

        Integer price,

        String link,
        MultipartFile multipartFile) {
}
