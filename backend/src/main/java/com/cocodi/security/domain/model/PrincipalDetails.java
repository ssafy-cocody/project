package com.cocodi.security.domain.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Map;

@Getter
@AllArgsConstructor
public class PrincipalDetails implements OAuth2User {

    private final Long memberId;
    private final Collection<? extends GrantedAuthority> authorities;
    private final Map<String, Object> attributes;

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // 사용자의 권한을 반환합니다.
        // 예를 들어, 사용자의 권한이 여러 개인 경우 이를 반환합니다.
        return authorities;
    }

    @Override
    public String getName() {
        return String.valueOf(memberId);
    }
}