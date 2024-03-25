package com.cocodi.member.presentation.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

public class MemberTestResponse {

    @Builder
    @Getter
    @Setter
    @AllArgsConstructor
    public static class TokenInfo {

        private String grantType;

        private String accessToken;

        private String refreshToken;

        private Long refreshTokenExpirationTime;

    }

}
