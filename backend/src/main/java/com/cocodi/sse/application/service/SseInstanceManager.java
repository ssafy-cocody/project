package com.cocodi.sse.application.service;

import lombok.Getter;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Getter
@Service
public class SseInstanceManager {
    private final Map<String, SseEmitter> instanceMap = new ConcurrentHashMap<>();

    public String createSseEmitter() {
        SseEmitter sseEmitter = new SseEmitter(1800_000L);
        String uuid = UUID.randomUUID().toString();

        // 완료 콜백 설정
        sseEmitter.onCompletion(() -> {
            instanceMap.remove(uuid);
        });

        // 타임아웃 콜백 설정
        sseEmitter.onTimeout(() -> {
            sseEmitter.complete();
            instanceMap.remove(uuid);
        });

        // 오류 콜백 설정 (선택 사항)
        sseEmitter.onError((e) -> {
            instanceMap.remove(uuid);
        });

        instanceMap.put(uuid, sseEmitter);
        return uuid;
    }

    public SseEmitter getSseEmitter(String key) {
        SseEmitter emitter = instanceMap.get(key);
        if (emitter == null) {
            throw new IllegalArgumentException("SseEmitter not found for key: " + key);
        }
        return emitter;
    }

    public void deleteSseEmitter(String key) {
        if (!instanceMap.containsKey(key)) {
            throw new IllegalArgumentException("SseEmitter not found for key: " + key);
        }
        instanceMap.get(key).complete();
        instanceMap.remove(key);
    }
}
