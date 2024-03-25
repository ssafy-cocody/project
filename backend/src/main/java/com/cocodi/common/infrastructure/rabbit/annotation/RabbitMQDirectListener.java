package com.cocodi.common.infrastructure.rabbit.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface RabbitMQDirectListener {
    String name();
    boolean isolatedQueue() default false;
}
