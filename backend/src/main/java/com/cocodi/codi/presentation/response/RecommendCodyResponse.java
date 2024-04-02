package com.cocodi.codi.presentation.response;

public record RecommendCodyResponse(
        Long codyId, boolean isMyCody, boolean isMyOotd, String codyImage
) {}
