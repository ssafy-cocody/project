package com.cocodi.codi.presentation.request;

import java.time.LocalDate;

public record OotdImageRequest(
        Long topId,
        Long bottomId,
        Long outerId,
        Long shoesId,
        LocalDate date
) {
}
