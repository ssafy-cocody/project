package com.cocodi.codi.presentation.response;

import java.time.LocalDate;
import java.util.List;

public record RecommendCodyListResponse(
        List<RecommendCodyResponse> recommendCodyResponse,
        LocalDate date

) {
}
