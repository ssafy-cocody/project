package com.cocodi.codi.domain.model;

import com.cocodi.member.domain.model.Member;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import static jakarta.persistence.FetchType.LAZY;
import static jakarta.persistence.GenerationType.IDENTITY;
import static lombok.AccessLevel.PROTECTED;

@Entity
@Getter
@NoArgsConstructor(access = PROTECTED)
public class MyCody {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long myCodiId;

    private String name;

    @OneToOne(fetch = LAZY)
    private Cody cody;

    @ManyToOne(fetch = LAZY)
    private Member member;

    @Builder
    private MyCody(String name, Cody cody, Member member) {
        this.name = name;
        this.cody = cody;
        this.member = member;
    }
}
