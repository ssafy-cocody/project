package com.cocodi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.redis.repository.configuration.EnableRedisRepositories;

@SpringBootApplication
@EnableRedisRepositories
public class CocodiApplication {

    public static void main(String[] args) {
        SpringApplication.run(CocodiApplication.class, args);
    }

}
