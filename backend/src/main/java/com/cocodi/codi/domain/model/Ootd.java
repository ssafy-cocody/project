package com.cocodi.codi.domain.model;

import com.cocodi.member.domain.model.Member;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

import static jakarta.persistence.FetchType.LAZY;
import static jakarta.persistence.GenerationType.IDENTITY;
import static lombok.AccessLevel.PROTECTED;

@Entity
@Getter
@NoArgsConstructor(access = PROTECTED)
public class Ootd {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long ootdId;

    @Temporal(TemporalType.DATE)
    private LocalDate date;

    private String snapShot;

    @ManyToOne(fetch = LAZY)
    private Cody cody;

    @ManyToOne(fetch = LAZY)
    private Member member;
}
