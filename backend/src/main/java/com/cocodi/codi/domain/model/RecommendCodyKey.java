package com.cocodi.codi.domain.model;

import lombok.Getter;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import java.time.LocalDate;

@Getter
@RedisHash("RecommendCodyKey")
public class RecommendCodyKey {
    @Id
    private String sseKey;
    private final Long memberId;
    private final LocalDate date;

    public RecommendCodyKey(String sseKey, Long memberId, LocalDate date) {
        this.sseKey = sseKey;
        this.memberId = memberId;
        this.date = date;
    }

    // getter, setter, toString 등의 메서드 생략
}