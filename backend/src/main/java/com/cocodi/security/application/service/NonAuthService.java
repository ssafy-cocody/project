package com.cocodi.security.application.service;

import com.cocodi.member.domain.model.Member;
import com.cocodi.member.domain.repository.MemberRepository;
import com.cocodi.member.infrastructure.exception.MemberFindException;
import com.cocodi.security.presentation.response.MemberInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NonAuthService {

    private final JwtTokenProvider jwtTokenProvider;
    private final MemberRepository memberRepository;

    public String getAccessToken(String token) {
        Long memberId = jwtTokenProvider.getUserId(token);
        return jwtTokenProvider.generateAccessToken(memberId);
    }

    public String getTestAccessToken() {
        return jwtTokenProvider.generateAccessToken(1L);
    }

    public MemberInfo getMemberInfo(String token) {
        Long memberId = jwtTokenProvider.getUserId(token);
        Member member = memberRepository.findById(memberId).orElseThrow(() -> new MemberFindException("can not find Member"));
        return new MemberInfo(
                member.getNickname(),
                member.getRole(),
                String.valueOf(member.getBirth()!= null ? member.getBirth().getYear() : null),
                member.getGender(),
                member.getProfile());
    }

}
