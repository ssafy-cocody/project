package com.cocodi.codi.presentation.response;

public record RecommendItemResponse(
   Long codyId, String image, String recommendClothesImage, String link, Long recommendId , String brand, Integer price, String name
) {}
