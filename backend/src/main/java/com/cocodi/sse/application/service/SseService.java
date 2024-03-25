package com.cocodi.sse.application.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;

@Service
@Slf4j
@RequiredArgsConstructor
public class SseService {
    private final SseInstanceManager sseInstanceManager;

    private void sendToInstance(String key, String eventName, String data) {
        SseEmitter sseEmitter = sseInstanceManager.getSseEmitter(key);
        try {
            sseEmitter.send(SseEmitter.event().name(eventName).data(data));
        } catch (IOException e) {
            sseEmitter.completeWithError(e);
            log.error("Failed to send SSE event: {} with data: {} due to {}", eventName, data, e.getMessage(), e);
        }
    }

    public void sendMessage(String key, String eventName, String data) {
        sendToInstance(key, eventName, data);
    }

    public void sendMessageAndRemove(String key, String eventName, String data) {
        try {
            sendMessage(key, eventName, data);
            sendMessage(key, "remove", "");
        } catch (Exception e) {
            log.info("SSE Disconnection");
        }
        finally {
            try  {
                sseInstanceManager.deleteSseEmitter(key);
            } catch (Exception e) {
                log.info("SSE Instance Lose");
            }
        }

    }

    public SseEmitter getInstance(String key) {
        return sseInstanceManager.getSseEmitter(key);
    }

    public String createInstance() {
        return sseInstanceManager.createSseEmitter();
    }
}
