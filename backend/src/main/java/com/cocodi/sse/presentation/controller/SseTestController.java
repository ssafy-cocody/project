package com.cocodi.sse.presentation.controller;

import com.cocodi.common.infrastructure.rabbit.dto.RabbitMQInfo;
import com.cocodi.common.infrastructure.rabbit.dto.RabbitMQRequest;
import com.cocodi.common.infrastructure.rabbit.util.RabbitMQStore;
import com.cocodi.sse.application.service.SseService;
import com.cocodi.sse.domain.model.SseObject;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/public/v1/member")
@RequiredArgsConstructor
public class SseTestController {
    private final SseService sseService;
    private final RabbitTemplate rabbitTemplate;
    private final RabbitMQStore rabbitMQStore;

    @CrossOrigin
    @GetMapping("/create")
    public ResponseEntity<String> testGet() {
        return ResponseEntity.ok(sseService.createInstance());
    }


    @CrossOrigin
    @GetMapping("/sse")
    public SseEmitter aiTest() {
        String sseKey = sseService.createInstance();
        RabbitMQInfo rabbitMQInfo = rabbitMQStore.find("test");
        SseObject sseObject = new SseObject(sseKey, "DATA");
        RabbitMQRequest rabbitMQRequest = new RabbitMQRequest(rabbitMQInfo.exchange(), rabbitMQInfo.routeKey(), sseObject);
        rabbitTemplate.convertAndSend("order_direct_exchange", "first_ai", rabbitMQRequest);
        return sseService.getInstance(sseKey);
    }

    @CrossOrigin
    @GetMapping("/sse/{key}")
    public SseEmitter getSse(@PathVariable("key") String key) {
        return sseService.getInstance(key);
    }

    @CrossOrigin
    @GetMapping("/test/{key}")
    public ResponseEntity<?> sendTest(@PathVariable("key") String key) {
        sseService.sendMessage(key, "message", "test");
        return ResponseEntity.ok().build();
    }

}
