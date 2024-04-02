package com.cocodi.codi.presentation.request;

import com.cocodi.clothes.presentation.request.ClothesPythonRequest;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

public record OotdImageRequest(

        ClothesPythonRequest clothesRequest,
        LocalDate date,
        MultipartFile ootdImage
) {
}
