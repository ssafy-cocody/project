package com.cocodi.member.domain.model;

import com.cocodi.member.domain.enums.Authority;
import com.cocodi.member.domain.enums.Gender;
import com.cocodi.member.domain.enums.ProviderType;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
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

    private String email;

    private LocalDate birth;

    private Gender gender;

    private String nickname;

    private String profile;

    @Enumerated(EnumType.STRING)
    private Authority role;

    @Enumerated(EnumType.STRING)
    private ProviderType providerType;

    private boolean isDeleted;

    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime createdAt;

    @Temporal(TemporalType.TIMESTAMP)
    private  LocalDateTime updatedAt;

    @Builder
    public Member(String email, LocalDate birth, Gender gender, String nickname, String profile, Authority role, ProviderType providerType, boolean isDeleted, LocalDateTime createdAt) {
        this.email = email;
        this.birth = birth;
        this.gender = gender;
        this.nickname = nickname;
        this.profile = profile;
        this.role = role;
        this.providerType = providerType;
        this.isDeleted = isDeleted;
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public void deleteMember() {
        this.isDeleted = true;
    }
}
