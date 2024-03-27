package com.cocodi.common.infrastructure.config;

import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class ConvertUtils {
    @NotNull
    public static List<Long> getLongs(List<?> listObj) {
        List<Long> longList = new ArrayList<>();

        for (Object item : listObj) {
            if (item instanceof Integer) {
                longList.add(Long.valueOf((Integer) item));
            } else if (item instanceof Long) {
                longList.add((Long) item);
            }
        }
        return longList;
    }
}
