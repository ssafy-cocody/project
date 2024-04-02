package com.cocodi.codi.presentation.response;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record ImageSearchResponse(
        @JsonProperty("TOP") List<ImageResponse> topList,
        @JsonProperty("BOTTOM") List<ImageResponse> bottomList,
        @JsonProperty("OUTER") List<ImageResponse> outerList,
        @JsonProperty("SHOES") List<ImageResponse> shoesList,
        @JsonProperty("ONEPIECE") List<ImageResponse> onepieceList) {
}
