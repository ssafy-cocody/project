package com.cocodi.codi.presentation.request;

import java.util.List;

public record RecommendItemRequest(
        List<Long> closet,
        String gender,
        Integer temperature
) {
}
