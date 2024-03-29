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
            clothesTempRepository.save(new ClothesTemp(sseObject.sseId(), hashMap.get("img").toString(), longList));
            sseService.sendMessageAndRemove(sseObject.sseId(), "message", sseObject.sseId());
        }
    }
}
