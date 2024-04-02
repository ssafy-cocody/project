package com.cocodi.codi.presentation.request;

import com.cocodi.clothes.presentation.request.ClothesPythonRequest;

public record RecommendItemPythonRequest(
        ClothesPythonRequest cody,
        Long recommend
) {
}
