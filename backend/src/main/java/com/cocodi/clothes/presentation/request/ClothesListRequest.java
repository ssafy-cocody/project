package com.cocodi.clothes.presentation.request;

import java.util.List;

public record ClothesListRequest(
        List<Long> top, List<Long> bottom, List<Long> shoes, List<Long> outer, List<Long> onepiece
) {
}
