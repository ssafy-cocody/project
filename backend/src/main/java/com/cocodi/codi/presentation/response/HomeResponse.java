package com.cocodi.codi.presentation.response;

import org.springframework.data.domain.Slice;

public record HomeResponse(
        RecommendCodyListResponse recommendCodyListResponse,
        RecommendItemResponse recommendItemResponse,
        Slice<CodyResponse> codyResponses
) {
}
