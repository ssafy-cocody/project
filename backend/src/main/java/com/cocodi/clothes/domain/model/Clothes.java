package com.cocodi.clothes.domain.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;

import static jakarta.persistence.EnumType.STRING;
import static jakarta.persistence.GenerationType.IDENTITY;
import static lombok.AccessLevel.PROTECTED;

@Entity
@Getter
@NoArgsConstructor(access = PROTECTED)
public class Clothes {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long clothesId;

    private String name;

    @Enumerated(STRING)
    private Category category;

    private String brand;

    private String productNo;

    @Enumerated(STRING)
    private Color color;

    private int price;

    private String link;

    private String image;

}
