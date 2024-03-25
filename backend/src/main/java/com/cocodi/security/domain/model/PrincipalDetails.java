package com.cocodi.security.domain.model;

import com.cocodi.member.domain.model.Member;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;

@Getter
@AllArgsConstructor
public class PrincipalDetails implements OAuth2User {

    private Member member;
    private Map<String, Object> attributes;
    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Collection<GrantedAuthority> collector = new ArrayList<>();
        collector.add(() -> String.valueOf(member.getRole()));
        return collector;
    }

    @Override
    public String getName() {
        return member.getNickname();
    }
}
