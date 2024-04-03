package com.cocodi.codi.presentation.request;

import java.util.List;

public record RecommendCodyRequest(
        List<Long> closet,
        Integer temperature,
        Integer count
) {
}
