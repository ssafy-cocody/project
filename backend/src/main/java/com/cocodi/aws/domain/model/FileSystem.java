package com.cocodi.aws.domain.model;

import com.cocodi.member.domain.model.Member;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

import static jakarta.persistence.GenerationType.IDENTITY;

@Entity
public class FileSystem {
    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long fileSystemId;

    private String fileName;

    private String fileUUID;

    @ManyToOne
    private Member member;
}
