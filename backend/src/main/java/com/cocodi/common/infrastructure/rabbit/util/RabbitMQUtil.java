package com.cocodi.common.infrastructure.rabbit.util;

import com.cocodi.common.infrastructure.rabbit.dto.RabbitMQInfo;
import com.cocodi.common.infrastructure.rabbit.dto.RabbitMQRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RabbitMQUtil {
    @Value("${server.name}")
    private String serverName;
    private final RabbitTemplate rabbitTemplate;
    private final RabbitMQStore rabbitMQStore;
    public String getServerNamingStrategy(String key) {
        return serverName + "_" + key;
    }

    private String getStrategy(String key, boolean isIsolate) {
        if (isIsolate) return getServerNamingStrategy(key);
        else return key;
    }

    public String getServerNamingStrategy(String key, boolean isIsolate) {
        return "route_" + getStrategy(key,isIsolate);
    }

    public void convertAndSend(String queueName, String exchange, String routingKey, Object value) {
        RabbitMQInfo rabbitMQInfo = rabbitMQStore.find(queueName);
        RabbitMQRequest rabbitMQRequest = new RabbitMQRequest(rabbitMQInfo.exchange(), rabbitMQInfo.routeKey(), value);
        rabbitTemplate.convertAndSend(exchange, routingKey, rabbitMQRequest);
    }
}