package com.cocodi.common.infrastructure.rabbit.dto;

public record RabbitMQRequest (
        String exchange,
        String routeKey,
        Object data
) {
}
