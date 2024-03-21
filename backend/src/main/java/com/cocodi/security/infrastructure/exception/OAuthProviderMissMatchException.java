package com.cocodi.security.infrastructure.exception;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class OAuthProviderMissMatchException extends RuntimeException {
    public OAuthProviderMissMatchException(String message) {
        super(message);
        log.error("OAuthProviderMissMatchException : {} ", message);
    }
}
