package com.cocodi.clothes.infrastructure.mq;

import com.cocodi.clothes.domain.model.ClothesTemp;
import com.cocodi.clothes.domain.repository.ClothesTempRepository;
import com.cocodi.common.infrastructure.rabbit.annotation.RabbitMQDirectListener;
import com.cocodi.common.infrastructure.rabbit.annotation.RabbitMQListenerEnable;
import com.cocodi.sse.application.service.SseService;
import com.cocodi.sse.domain.model.SseObject;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

import static com.cocodi.common.infrastructure.config.ConvertUtils.getLongs;

@Component
@Slf4j
@RequiredArgsConstructor
@RabbitMQListenerEnable(domainName = "clothes")
public class ClothesRabbitListener {
    private final SseService sseService;
    private final ClothesTempRepository clothesTempRepository;

    @RabbitMQDirectListener(name = "extract_img", isolatedQueue = true, lazy = true)
    public void extractImg(SseObject sseObject) {
        HashMap<?, ?> hashMap = (HashMap<?, ?>) sseObject.data();
        Object listObj = hashMap.get("list");

        if (listObj instanceof List<?>) {
            List<Long> longList = getLongs((List<?>) listObj);
            String uuid = UUID.randomUUID().toString();
            saveWithRetry(new ClothesTemp(uuid, hashMap.get("img").toString(), longList), 3, 1000)
                    .thenRun(() -> sseService.sendMessageAndRemove(sseObject.sseId(), "message", uuid)).exceptionally(ex -> {
                        log.info("Failed to save ClothesTemp after retries: " + ex.getMessage());
                        return null;});
        }
    }


    private CompletableFuture<Void> saveWithRetry(ClothesTemp clothesTemp, int maxRetries, int delay) {
        return CompletableFuture.runAsync(() -> {
            clothesTempRepository.save(clothesTemp);
            if (!clothesTempRepository.existsById(clothesTemp.getUuid())) {
                throw new RuntimeException();
            }
            else {
                clothesTempRepository.findById(clothesTemp.getUuid()).orElseThrow();
            }
        }).exceptionallyCompose(ex -> {
            if (maxRetries > 0) {
                // 재시도 전에 지정된 지연 시간 동안 대기
                return CompletableFuture.runAsync(() -> {
                    try {
                        TimeUnit.MILLISECONDS.sleep(delay);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                    }
                }).thenCompose(aVoid -> saveWithRetry(clothesTemp, maxRetries - 1, delay));
            } else {
                // 재시도 횟수를 모두 소진한 경우 예외를 전파
                throw new RuntimeException("Failed to save ClothesTemp to Redis", ex);
            }
        });
    }
}
