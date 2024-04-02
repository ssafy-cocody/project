package com.cocodi.codi.presentation.request;

import com.cocodi.clothes.presentation.request.ClothesPythonRequest;

import java.time.LocalDate;

public record OotdImageRequest(

        ClothesPythonRequest clothesRequest,
        LocalDate date
) {
}
