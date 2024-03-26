package com.cocodi.codi.domain.model;

import com.cocodi.clothes.domain.model.Clothes;
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
public class Cody {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long codiId;

    private String image;

    @ManyToOne(fetch = LAZY)
    private Clothes top;

    @ManyToOne(fetch = LAZY)
    private Clothes bottom;

    @ManyToOne(fetch = LAZY)
    private Clothes outer;

    @ManyToOne(fetch = LAZY)
    private Clothes onepiece;

    @ManyToOne(fetch = LAZY)
    private Clothes shoes;

    @Builder
    private Cody(String image, Clothes top, Clothes bottom, Clothes outer, Clothes shoes) {
        this.image = image;
        this.top = top;
        this.bottom = bottom;
        this.outer = outer;
        this.shoes = shoes;
    }
}
