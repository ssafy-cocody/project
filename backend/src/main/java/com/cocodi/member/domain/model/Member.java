package com.cocodi.member.domain.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

import static jakarta.persistence.GenerationType.IDENTITY;
import static lombok.AccessLevel.PROTECTED;

@Entity
@Getter
@NoArgsConstructor(access = PROTECTED)
public class Member {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long memberId;

    private String name;

    private String email;

    private Integer age;

    private boolean gender;

    private String nickname;

    private String profile;

    @Enumerated(EnumType.STRING)
    private LoginType loginType;

    private boolean isDeleted;

    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime createdAt;

    @Temporal(TemporalType.TIMESTAMP)
    private  LocalDateTime updatedAt;

}
