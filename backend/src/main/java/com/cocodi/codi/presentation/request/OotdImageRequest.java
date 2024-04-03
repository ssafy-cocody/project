package com.cocodi.codi.presentation.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

@JsonIgnoreProperties
public record OotdImageRequest(
        Long top,
        Long bottom,
        Long outer,
        Long shoes,
        Long onepiece,
        LocalDate date,
        MultipartFile ootdImage
) {
}
