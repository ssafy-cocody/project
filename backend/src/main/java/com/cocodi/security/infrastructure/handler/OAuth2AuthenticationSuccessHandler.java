package com.cocodi.security.infrastructure.handler;

import com.cocodi.member.domain.enums.Authority;
import com.cocodi.member.domain.enums.ProviderType;
import com.cocodi.member.domain.model.Member;
import com.cocodi.member.domain.repository.MemberRepository;
import com.cocodi.security.application.dto.GeneratedToken;
import com.cocodi.security.application.dto.RefreshToken;
import com.cocodi.security.application.service.JwtTokenProvider;
import com.cocodi.security.domain.repository.RefreshTokenRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtTokenProvider jwtTokenProvider;
    private final MemberRepository memberRepository;
    private final RefreshTokenRepository refreshTokenRepository;

    @Value("${REFRESH_TOKEN_EXPIRE_TIME}")
    private Long refreshTokenExpireTime;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        log.info("onAuthenticationSuccess start");
        // OAuth2User 로 캐스팅하여 인증된 사용자 정보를 가져온다.
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        // 사용자 이메일을 가져온다.
        String email = oAuth2User.getAttribute("email");
        // 서비스 제공 플랫폼이 어디인지 가져온다.
        String provider = oAuth2User.getAttribute("provider");
        // CustomOAuth2UserService 에서 세팅한 로그인한 회원 존재 여부를 가져온다.
        Boolean isExist = oAuth2User.getAttribute("exist");
        // OAuth2User 로부터 Role 을 얻어온다.
        String role = oAuth2User.getAuthorities().stream()
                .findFirst().orElseThrow(IllegalAccessError::new)   // 존재하지 않을 시 예외
                .getAuthority();

        Long memberId;

        // 회원이 존재
        if (isExist != null && isExist) {
            memberId = memberRepository.findByEmail(email).orElseThrow(IllegalArgumentException::new).getMemberId();
        } else {    // 회원 없음
            Member member = Member.builder()
                    .email(email)
                    .role(Authority.GUEST)
                    .nickname(oAuth2User.getAttribute("nickname"))
                    .profile(oAuth2User.getAttribute("profile"))
                    .providerType(ProviderType.valueOf(provider.toUpperCase()))
                    .build();
            memberId = memberRepository.save(member).getMemberId();
        }

        GeneratedToken generatedToken = jwtTokenProvider.generateToken(memberId);
        log.info("accessToken = {}", generatedToken.getAccessToken());
        ResponseCookie refreshTokenCookie = ResponseCookie.from("refreshToken", generatedToken.getRefreshToken())
                .maxAge(refreshTokenExpireTime)
                .secure(false)
                .httpOnly(true)
                .path("/")
                .build();

        //프론트로 헤더에 accessToken, 쿠키에 refreshToken 을 들고 감
        response.setHeader(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString());

        //리프레시 토큰 레디스에 저장 -> 비교목적
        refreshTokenRepository.save(new RefreshToken(generatedToken.getRefreshToken()));

        String url;
        if (!role.equals("ROLE_GUEST")) {
            url = "https://j10a307.p.ssafy.io/";
        } else {
            url = "https://j10a307.p.ssafy.io/signup";
        }
        String targetUrl = UriComponentsBuilder.fromUriString(url)
                .build()
                .encode(StandardCharsets.UTF_8)
                .toUriString();
        // 회원가입 페이지로 리다이렉트 시킨다.
        getRedirectStrategy().sendRedirect(request, response, targetUrl);

    }

}
