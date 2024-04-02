package com.cocodi.codi.presentation.request;

import com.cocodi.clothes.presentation.request.ClothesImageRequest;

import java.util.List;

public record ClothesImageListRequest(
        List<ClothesImageRequest> codies
) {
}
