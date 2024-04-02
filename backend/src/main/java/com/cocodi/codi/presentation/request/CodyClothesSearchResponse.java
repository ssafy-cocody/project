package com.cocodi.codi.presentation.request;

import java.util.List;

public record CodyClothesSearchResponse(
        List<Long> list, String image
) {
}
