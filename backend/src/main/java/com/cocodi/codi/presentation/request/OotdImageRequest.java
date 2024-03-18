package com.cocodi.codi.presentation.request;

public record OotdImageRequest(

        String image,

        Long topId,
        Long bottomId,
        Long outerId,
        Long shoesId
) {
}
