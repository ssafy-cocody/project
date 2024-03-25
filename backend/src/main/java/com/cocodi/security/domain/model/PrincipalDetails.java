package com.cocodi.security.domain.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Map;

@Getter
@AllArgsConstructor
public class PrincipalDetails implements UserDetails, OAuth2User {

    private final Long memberId;

    @Override
    public Map<String, Object> getAttributes() {
        return null;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // 사용자의 권한을 반환합니다.
        // 예를 들어, 사용자의 권한이 여러 개인 경우 이를 반환합니다.
        return null;
    }

    @Override
    public String getPassword() {
        // 패스워드를 반환합니다.
        return null;
    }

    @Override
    public String getUsername() {
        // 사용자의 아이디(이메일 등)를 반환합니다.
        return null;
    }

    // 아래의 메서드들은 필요에 따라 구현합니다.
    // 기본적으로 UserDetails 인터페이스의 메서드들은 사용자 정보를 반환합니다.
    // 필요에 따라 추가적인 정보를 반환하거나 인증 처리 등을 위해 구현합니다.

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public String getName() {
        return null;
    }
}