package com.cocodi.clothes.presentation.request;

import com.cocodi.clothes.domain.model.Category;
import com.cocodi.clothes.domain.model.Color;

public record ClothesCreateRequest(
        Long clothesId,

        Category category,

        String name,

        Color color,

        String brand,

        String productNo,

        Integer price,

        String link) {
}
