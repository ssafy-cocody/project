package com.cocodi.codi.presentation.request;

import com.cocodi.clothes.presentation.request.ClothesRequest;

import java.time.LocalDate;

public record OotdImageRequest(
        ClothesRequest clothesRequest,
        LocalDate date
) {
}
