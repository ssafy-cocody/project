package com.cocodi.clothes.presentation.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties
public record ClothesPythonRequest(
        Long top,
        Long bottom,
        Long outer,
        Long shoes,
        Long onepiece
){
}