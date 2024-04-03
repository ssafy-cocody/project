package com.cocodi.codi.presentation.request;

import com.cocodi.clothes.presentation.request.ClothesPythonRequest;

public record CodyCreateRequest(
        ClothesPythonRequest clothesPythonRequest,
        String name

) {
}
