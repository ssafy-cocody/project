package com.cocodi.codi.presentation.response;

import java.util.List;

public record ImageSearchResponse(
        List<ImageResponse> topList,
        List<ImageResponse> bottomList,
        List<ImageResponse> outerList,
        List<ImageResponse> shoesList
) {
}
