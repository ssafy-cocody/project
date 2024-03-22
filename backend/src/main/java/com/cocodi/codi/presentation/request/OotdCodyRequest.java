package com.cocodi.codi.presentation.request;

import java.time.LocalDateTime;

public record OotdCodyRequest(
        LocalDateTime date,
        Long codyId
) {
}
