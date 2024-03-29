package com.cocodi.clothes.presentation.request;

public record ClothesRequest(
        Long topId,
        Long bottomId,
        Long outerId,
        Long shoesId,
        Long onepieceId
) {
}
