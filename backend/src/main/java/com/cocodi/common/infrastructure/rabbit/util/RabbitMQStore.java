package com.cocodi.common.infrastructure.rabbit.util;

import com.cocodi.common.infrastructure.rabbit.dto.RabbitMQInfo;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
@RequiredArgsConstructor
public class RabbitMQStore {

    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final ConcurrentHashMap<String, RabbitMQInfo> cache = new ConcurrentHashMap<>();

    public void create(String exchange, String routeKey, String queueName) {
        try {
            String key = "rabbitmq:info:" + queueName;
            if (Boolean.FALSE.equals(redisTemplate.hasKey(key))) {
                RabbitMQInfo info = new RabbitMQInfo(exchange, routeKey);
                String value = objectMapper.writeValueAsString(info);
                redisTemplate.opsForValue().set(key, value);
                cache.put(queueName, info);
            }
        } catch (JsonProcessingException e) {
            log.info(String.valueOf(e.getCause()));
        }
    }

    public RabbitMQInfo find(String queueName) {
        RabbitMQInfo info = cache.get(queueName);
        if (info != null) {
            return info;
        }

        try {
            String key = "rabbitmq:info:" + queueName;
            String value = redisTemplate.opsForValue().get(key);
            if (value != null) {
                info = objectMapper.readValue(value, RabbitMQInfo.class);
                cache.put(queueName, info);
                return info;
            }
        } catch (Exception e) {
            log.info(String.valueOf(e.getCause()));
        }
        return null;
    }
}