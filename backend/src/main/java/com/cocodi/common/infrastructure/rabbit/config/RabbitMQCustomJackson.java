package com.cocodi.common.infrastructure.rabbit.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.jetbrains.annotations.NotNull;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConversionException;

public class RabbitMQCustomJackson extends Jackson2JsonMessageConverter {
    private final ObjectMapper objectMapper;
    private final Class<?> targetClass;

    public RabbitMQCustomJackson(ObjectMapper objectMapper,Class<?> targetClass) {
        this.objectMapper = objectMapper;
        this.targetClass = targetClass;
    }

    @Override
    public @NotNull Object fromMessage(@NotNull Message message) throws MessageConversionException {
        try {
            return objectMapper.readValue(message.getBody(), targetClass);
        } catch (Exception e) {
            throw new MessageConversionException("Error converting message to SseObject", e);
        }
    }
}
