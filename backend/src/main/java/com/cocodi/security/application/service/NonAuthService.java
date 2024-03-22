package com.cocodi.security.application.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NonAuthService {

    private final JwtTokenProvider jwtTokenProvider;

    public String getAccessToken(String token) {
        Long memberId = jwtTokenProvider.getUserId(token);
        return jwtTokenProvider.generateAccessToken(memberId);
    }

}
