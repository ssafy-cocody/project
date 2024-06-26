package com.cocodi.security.infrastructure.filter;

import com.cocodi.member.domain.model.Member;
import com.cocodi.member.domain.repository.MemberRepository;
import com.cocodi.security.application.service.JwtTokenProvider;
import com.cocodi.security.domain.model.PrincipalDetails;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final MemberRepository memberRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        log.info("JwtAuthenticationFilter 시작");
        // request Header 에서 AccessToken 을 가져온다.
        String accessToken = request.getHeader("Authorization");
        log.info("accessToken = {}", accessToken);
        String refreshToken = "";
        //쿠키 가져오기
        Cookie[] cookies = request.getCookies();

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("refreshToken")) {
                    refreshToken = cookie.getValue();
                }
            }
        }

        // 토큰 검사 생략(모두 허용 URL 의 경우 토큰 검사 통과
        if (!StringUtils.hasText(accessToken)) {
            doFilter(request, response, filterChain);
            return;
        }

        log.info("token validation check start");
        if (!jwtTokenProvider.validateToken(accessToken)) {
            log.info("token 유효하지 않음");
            if (!refreshToken.isEmpty()) {
                log.info("refreshToken 검증");
                // 리프레시 토큰 만료시간 검증
                boolean validateRefreshToken = jwtTokenProvider.validateToken(refreshToken);
                // 리프레시 토큰 저장소 존재유무 확인
                boolean isRefreshToken = jwtTokenProvider.existsRefreshToken(refreshToken);
                if (validateRefreshToken && isRefreshToken) {
                    log.info("refreshToken 으로 accessToken 발급");
                    // 리프레시 토큰으로 userId 정보 가져오기
                    Long userId = jwtTokenProvider.getUserId(refreshToken);
                    String newAccessToken = jwtTokenProvider.generateAccessToken(userId);
                    log.info("accessToken = {}", accessToken);
                    // 응답헤더에 어세스 토큰 추가
                    jwtTokenProvider.setHeaderAccessToken(response, newAccessToken);
//                    SecurityContextHolder.getContext().setAuthentication(new MemberAuthentication(userId));
                    OAuth2User principalDetails = new PrincipalDetails(jwtTokenProvider.getUserId(accessToken), null, null);
                    SecurityContextHolder.getContext().setAuthentication(new OAuth2AuthenticationToken(principalDetails, principalDetails.getAuthorities(), "dsf"));
                }
            }
        } else { // AccessToken 의 값이 있고, 유효한 경우에 진행
            log.info("token 유효");
            log.info(jwtTokenProvider.getUserId(accessToken).toString());
            OAuth2User principalDetails = new PrincipalDetails(jwtTokenProvider.getUserId(accessToken), null, null);
//            log.info(principalDetails.ge);
            SecurityContextHolder.getContext().setAuthentication(new OAuth2AuthenticationToken(principalDetails, principalDetails.getAuthorities(), "dsf"));
        }
        filterChain.doFilter(request, response);
    }

    private void createUser(String accessToken) {
        Member findMember = memberRepository.findById(jwtTokenProvider.getUserId(accessToken))
                .orElseThrow(IllegalStateException::new);
        // SecurityContext 에 등록할 User 객체를 만들어준다.
        Authentication auth = getAuthentication(findMember);
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    public Authentication getAuthentication(Member member) {
        return new UsernamePasswordAuthenticationToken(member, "",
                List.of(new SimpleGrantedAuthority(member.getRole().toString())));
    }

}
