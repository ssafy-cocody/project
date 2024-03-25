package com.cocodi.common.infrastructure.rabbit.config;

import com.cocodi.common.infrastructure.rabbit.util.RabbitMQStore;
import com.cocodi.common.infrastructure.rabbit.util.RabbitMQUtil;
import com.cocodi.common.infrastructure.rabbit.annotation.RabbitMQDirectListener;
import com.cocodi.common.infrastructure.rabbit.annotation.RabbitMQListenerEnable;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.amqp.rabbit.listener.SimpleMessageListenerContainer;
import org.springframework.amqp.rabbit.listener.adapter.MessageListenerAdapter;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Configuration;

import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class RabbitMQListenerDirectRegister {

    private final ApplicationContext applicationContext;
    private final ConnectionFactory connectionFactory;
    private final RabbitMQUtil rabbitMQUtil;
    private final RabbitAdmin rabbitAdmin;
    private final Map<String, SimpleMessageListenerContainer> listenerContainers = new HashMap<>();
    private final RabbitMQStore rabbitMQStore;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private void ensureQueueAndExchange(RabbitMQListenerEnable domain, RabbitMQDirectListener workflow) {
        String exchangeName = domain.domainName();
        String routingKey = rabbitMQUtil.getServerNamingRouteStrategy(workflow.name(), workflow.isolatedQueue());
        String queueName = rabbitMQUtil.getServerNamingQueueStrategy(workflow.name(), workflow.isolatedQueue());
        rabbitMQStore.create(exchangeName, routingKey, workflow.name());

        if (rabbitAdmin.getQueueProperties(queueName) != null &&
                !Objects.requireNonNull(rabbitAdmin.getQueueProperties(queueName)).isEmpty()) {
            log.info("Queue {} already exists, skipping creation.", queueName);
            return;
        }

        Queue queue = new Queue(queueName, true);
        DirectExchange exchange = new DirectExchange(exchangeName);

        rabbitAdmin.declareQueue(queue);
        rabbitAdmin.declareExchange(exchange);

        Binding binding = BindingBuilder.bind(queue).to(exchange).with(routingKey);
        rabbitAdmin.declareBinding(binding);
    }

    private void registerDirectListener(Object bean, Method method, RabbitMQDirectListener workflow) {
        String queueName = rabbitMQUtil.getServerNamingQueueStrategy(workflow.name(), workflow.isolatedQueue());
        if (listenerContainers.containsKey(queueName)) {
            log.info("ListenerContainer for queue {} already exists, skipping registration.", queueName);
            return;
        }

        MessageListenerAdapter adapter = new MessageListenerAdapter(bean, method.getName());
        if (method.getParameterTypes().length > 0) {
            adapter.setMessageConverter(new RabbitMQCustomJackson(objectMapper, method.getParameterTypes()[0]));
        }

        SimpleMessageListenerContainer container = new SimpleMessageListenerContainer(connectionFactory);
        container.setMessageListener(adapter);

        container.setQueueNames(queueName);
        container.start();

        listenerContainers.put(queueName, container);
        log.info("Registered ListenerContainer for queue {}", queueName);
    }

    @PostConstruct
    public void init() {
        applicationContext.getBeansWithAnnotation(RabbitMQListenerEnable.class).values().forEach(bean -> {
            Class<?> beanClass = bean.getClass();
            RabbitMQListenerEnable listenerEnable = beanClass.getAnnotation(RabbitMQListenerEnable.class);
            for (Method method : beanClass.getMethods()) {
                RabbitMQDirectListener annotation = method.getAnnotation(RabbitMQDirectListener.class);
                if (annotation != null) {
                    ensureQueueAndExchange(listenerEnable, annotation);
                    registerDirectListener(bean, method, annotation);
                }
            }
        });
    }

    @PreDestroy
    public void destroy() {
        listenerContainers.values().forEach(container -> {
            if (container.isRunning()) {
                container.stop();
                log.info("Stopped and removed ListenerContainer for queue {}", (Object) container.getQueueNames());
            }
        });
    }
}