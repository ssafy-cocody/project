package com.cocodi.clothes.domain.model;

import lombok.Getter;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.TimeToLive;

@Getter
@RedisHash("clothes")
public class ClothesTemp {
    @Id
    private String uuid;
    @TimeToLive
    private Long expireTime;
    private String img;

    public ClothesTemp(String uuid, String img) {
        this.uuid = uuid;
        this.expireTime = 1800L;
        this.img = img;
    }
}
