package com.cocodi.codi.presentation.request;

import java.time.LocalDate;

public record OotdImageRequest(
        ClothesRequest clothesRequest,
        LocalDate date
) {
}
