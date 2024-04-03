package com.cocodi.codi.presentation.request;

import com.cocodi.clothes.presentation.request.ClothesPythonRequest;
import com.cocodi.sse.domain.model.SseObject;

import java.util.Map;

public record RecommendItemPythonRequest(
        ClothesPythonRequest cody,
        Long recommend
) {
    public static RecommendItemPythonRequest fromSseObject(SseObject sseObject) {
        // 'codies'와 'recommend'를 추출
        Map<String, Object> data = (Map<String, Object>) sseObject.data();
        Map<String, Object> codiesData = (Map<String, Object>) data.get("codies");

        // 'cody'를 추출하여 ClothesPythonRequest로 매핑
        Map<String, Integer> codyData = (Map<String, Integer>) codiesData.get("cody");

        Integer top = codyData.getOrDefault("top", null);
        Integer bottom = codyData.getOrDefault("bottom", null);
        Integer outer = codyData.getOrDefault("outer", null);
        Integer shoes = codyData.getOrDefault("shoes", null);
        Integer onepiece = codyData.getOrDefault("onepiece", null);

        ClothesPythonRequest cody = new ClothesPythonRequest(
                top==null?null:top.longValue(),
                bottom==null?null:bottom.longValue(),
                outer==null?null:outer.longValue(),
                shoes==null?null:shoes.longValue(),
                onepiece==null?null:onepiece.longValue()
        );

        // 'recommend'를 추출
        Long recommend = ((Integer)codiesData.get("recommend")).longValue();

        return new RecommendItemPythonRequest(cody, recommend);
    }
}
