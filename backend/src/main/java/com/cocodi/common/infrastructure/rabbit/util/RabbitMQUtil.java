package com.cocodi.common.infrastructure.rabbit.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class RabbitMQUtil {
    @Value("${server.name}")
    private String serverName;

    public String getServerNamingStrategy(String key) {
        return serverName + "_" + key;
    }

    private String getStrategy(String key, boolean isIsolate) {
        if (isIsolate) return getServerNamingStrategy(key);
        else return key;
    }

    public String getServerNamingQueueStrategy(String key, boolean isIsolate) {
        return "route_" + getStrategy(key,isIsolate);
    }

    public String getServerNamingExchangeStrategy(String key, boolean isIsolate) {
        return "route_" + getStrategy(key,isIsolate);
    }

    public String getServerNamingRouteStrategy(String key, boolean isIsolate) {
        return "route_" + getStrategy(key,isIsolate);
    }

}