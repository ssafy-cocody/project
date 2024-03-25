package com.cocodi.security.domain.model;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

public class MemberAuthentication implements Authentication {

    private final Long memberId;
    private boolean authenticated = true;

    public MemberAuthentication(Long memberId) {
        this.memberId = memberId;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // 여기서 사용자의 권한을 정의할 수 있습니다. 예를 들어, 기본 권한을 부여합니다.
        return null;
    }

    @Override
    public Object getCredentials() {
        return null; // 자격 증명 정보를 반환하려면 여기에 구현합니다.
    }

    @Override
    public Object getDetails() {
        return null; // 추가적인 인증 관련 정보를 반환하려면 여기에 구현합니다.
    }

    @Override
    public Long getPrincipal() {
        return memberId; // 주체(사용자)를 식별하는 정보를 반환합니다.
    }

    @Override
    public boolean isAuthenticated() {
        return authenticated;
    }

    @Override
    public void setAuthenticated(boolean authenticated) throws IllegalArgumentException {
        this.authenticated = authenticated;
    }

    @Override
    public String getName() {
        return null; // 사용자 이름을 반환하려면 여기에 구현합니다.
    }
}