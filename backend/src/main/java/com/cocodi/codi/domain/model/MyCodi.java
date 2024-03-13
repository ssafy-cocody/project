package com.cocodi.codi.domain.model;

import com.cocodi.member.domain.model.Member;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import static jakarta.persistence.FetchType.LAZY;
import static jakarta.persistence.GenerationType.IDENTITY;
import static lombok.AccessLevel.PROTECTED;

@Entity
@Getter
@NoArgsConstructor(access = PROTECTED)
public class MyCodi {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long myCodiId;

    private String name;

    @OneToOne(fetch = LAZY)
    private Codi codi;

    @ManyToOne(fetch = LAZY)
    private Member member;
}
