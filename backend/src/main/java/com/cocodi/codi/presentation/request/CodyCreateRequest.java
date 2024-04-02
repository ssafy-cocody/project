package com.cocodi.codi.presentation.request;

import com.cocodi.clothes.presentation.request.ClothesRequest;

public record CodyCreateRequest(
        ClothesRequest clothesRequest,
        String name

) {
}
