package com.cocodi.clothes.infrastructure;

import com.cocodi.clothes.domain.model.ClothesTemp;
import com.cocodi.clothes.domain.repository.ClothesTempRepository;
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
@RabbitMQListenerEnable(domainName = "clothes")
public class ClothesRabbitListener {
    private final SseService sseService;
    private final ClothesTempRepository clothesTempRepository;

    @RabbitMQDirectListener(name = "extract_img", isolatedQueue = true, lazy = true)
    public void extractImg(SseObject sseObject) {
        clothesTempRepository.save(new ClothesTemp(sseObject.sseId(), sseObject.data().toString()));
        sseService.sendMessageAndRemove(sseObject.sseId(), "message", sseObject.sseId());
    }
}
