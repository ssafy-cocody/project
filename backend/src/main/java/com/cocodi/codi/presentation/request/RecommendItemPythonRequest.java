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
        Map<String, Long> codyData = (Map<String, Long>) codiesData.get("cody");
        ClothesPythonRequest cody = new ClothesPythonRequest(
                codyData.get("top"),
                codyData.get("bottom"),
                codyData.get("outer"),
                codyData.get("shoes"),
                codyData.get("onepiece")
        );

        // 'recommend'를 추출
        Long recommend = (Long) codiesData.get("recommend");

        return new RecommendItemPythonRequest(cody, recommend);
    }
}
