package com.cocodi.codi.presentation.request;

import com.cocodi.clothes.presentation.request.ClothesPythonRequest;

import java.util.List;

public record RecommendPythonRequest(
        List<ClothesPythonRequest> codies
) {
}
