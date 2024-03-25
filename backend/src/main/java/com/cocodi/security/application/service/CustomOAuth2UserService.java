package com.cocodi.security.application.service;

import com.cocodi.member.domain.enums.Authority;
import com.cocodi.member.domain.enums.ProviderType;
import com.cocodi.member.domain.model.Member;
import com.cocodi.member.domain.repository.MemberRepository;
import com.cocodi.security.domain.model.PrincipalDetails;
import com.cocodi.security.infrastructure.exception.OAuthProviderMissMatchException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final MemberRepository memberRepository;
    private static final String ALREADY_SIGNED_UP_SOCIAL = "already_signed_up_social";

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        log.info("CustomOAuth2UserService.loadUser() 실행 - OAuth2 로그인 요청 진입");
        // 기본 OAuth2UserService 객체 생성
        OAuth2UserService<OAuth2UserRequest, OAuth2User> oAuth2UserService = new DefaultOAuth2UserService();

        // OAuth2UserService 를 사용하여 OAuth2User 정보를 가져온다.
        OAuth2User oAuth2User = oAuth2UserService.loadUser(userRequest);

        ProviderType providerType = ProviderType.valueOf(userRequest.getClientRegistration().getRegistrationId().toUpperCase());

        // 클라이언트 등록 ID(kakao)와 사용자 이름 속성을 가져온다.
        String registrationId = userRequest.getClientRegistration().getRegistrationId();

        // OAuth2UserService 를 사용하여 가져온 OAuth2User 정보로 OAuth2Attribute 객체를 만든다.
        OAuth2Attribute oAuth2Attribute = OAuth2Attribute.of(registrationId, oAuth2User.getAttributes());

        // OAuth2Attribute 의 속성 값들을 Map 으로 반환 받는다.
        Map<String, Object> memberAttribute = oAuth2Attribute.convertToMap();

        // 사용자 email(또는 id) 정보를 가져온다.
        String email = (String) memberAttribute.get("email");
        // 이메일로 가입된 회원인지 조회한다.
        Optional<Member> findMember = memberRepository.findByEmail(email);

        if (findMember.isPresent()) { // 존재한다면
            if (findMember.get().getProviderType() != providerType) {
                throw new OAuthProviderMissMatchException(ALREADY_SIGNED_UP_SOCIAL);
            } else {
//                // 회원이 존재할경우, memberAttribute 의 exist 값을 true 로 넣어준다.
//                memberAttribute.put("exist", true);
                // 회원의 권한과, 회원속성, 속성이름을 이용해 DefaultOAuth2User 객체를 생성해 반환한다.
//                return new DefaultOAuth2User(
//                        Collections.singleton(new SimpleGrantedAuthority("ROLE_".concat(String.valueOf(findMember.get().getRole())))),
//                        memberAttribute, "email"
//                );
                return new PrincipalDetails(findMember.get(), oAuth2User.getAttributes());
            }
        } else {
//            // 회원이 존재하지 않을 경우, memberAttribute 의 exist 값을 false 로 넣어준다.
//            memberAttribute.put("exist", false);
            Member member = Member.builder()
                    .email(email)
                    .role(Authority.GUEST)
                    .nickname(oAuth2User.getAttribute("nickname"))
                    .profile(oAuth2User.getAttribute("profile"))
                    .providerType(providerType)
                    .build();
            // 회원의 권한(회원이 존재하지 않으므로 기본권한인 ROLE_GUEST 를 넣어준다), 회원속성, 속성이름을 이용해 DefaultOAuth2User 객체를 생성해 반환한다.
            return new PrincipalDetails(memberRepository.save(member), oAuth2User.getAttributes());
//            return new DefaultOAuth2User(
//                    Collections.singleton(new SimpleGrantedAuthority("GUEST")),
//                    memberAttribute, "email"
//            );
        }
    }

}
