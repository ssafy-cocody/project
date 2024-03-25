package com.cocodi.member.infrastructure.exception;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class MemberFindException extends RuntimeException{

    public MemberFindException(String message) {
        super(message);
        log.error("MemberFindException : {} ", message);
    }

}
