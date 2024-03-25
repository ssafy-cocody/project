package com.cocodi.clothes.presentation.response;

import com.cocodi.clothes.domain.model.Category;
import com.cocodi.clothes.domain.model.Color;

public record ClothesResponse(
        Long clothesId,

        String name,

        Category category,

        String brand,

        String productNo,

        Color color,

        int price,

        String link,

        String image
) {
}
