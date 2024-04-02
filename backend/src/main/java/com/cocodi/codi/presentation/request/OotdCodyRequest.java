package com.cocodi.codi.presentation.request;

import java.time.LocalDate;

public record OotdCodyRequest(
        LocalDate date,
        Long codyId
) {
}
