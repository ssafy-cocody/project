package com.cocodi.codi.infrastructure.rabbit;

import com.cocodi.common.infrastructure.rabbit.annotation.RabbitMQDirectListener;
import com.cocodi.common.infrastructure.rabbit.annotation.RabbitMQListenerEnable;
import com.cocodi.sse.application.service.SseService;
import com.cocodi.sse.domain.model.SseObject;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
@RabbitMQListenerEnable(domainName = "sse")
public class CodiRabbitListener {
    private final SseService sseService;

    @RabbitMQDirectListener(name = "test", isolatedQueue = true)
    public void test(SseObject sseObject) {
        sseService.sendMessageAndRemove(sseObject.sseId(), "message", sseObject.data().toString());
    }
}
