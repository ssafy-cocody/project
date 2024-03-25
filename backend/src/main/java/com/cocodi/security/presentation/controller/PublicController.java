package com.cocodi.security.presentation.controller;

import com.cocodi.security.application.service.JwtTokenProvider;
import com.cocodi.security.application.service.NonAuthService;
import com.cocodi.security.presentation.response.MemberInfo;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/public")
@RequiredArgsConstructor
public class PublicController {

    private final NonAuthService nonAuthService;
    private final JwtTokenProvider jwtTokenProvider;
    @GetMapping
    public ResponseEntity<MemberInfo> getAccessToken(HttpServletRequest request) {
        try {
            Cookie[] cookies = request.getCookies();;
            for (Cookie cookie : cookies) {
                if ("refreshToken".equals(cookie.getName())) {
                    String refreshToken = cookie.getValue();
                    if(jwtTokenProvider.validateToken(refreshToken)) {
                        String accessToken = nonAuthService.getAccessToken(refreshToken);
                        HttpHeaders headers = new HttpHeaders();
                        headers.add(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken);
                        MemberInfo memberInfo = nonAuthService.getMemberInfo(accessToken);
                        return new ResponseEntity<>(memberInfo, headers, HttpStatus.OK);
                    } else {
                        break;
                    }
                }
            }
        } catch (Exception e) {
            log.error(e.getMessage());
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        return new ResponseEntity<>(HttpStatus.BAD_GATEWAY);
    }

    @GetMapping("/test")
    public ResponseEntity<MemberInfo> getTest() {
        String accessToken =  nonAuthService.getTestAccessToken();
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken);
        MemberInfo memberInfo = nonAuthService.getMemberInfo(accessToken);
        return ResponseEntity.ok().headers(headers).body(memberInfo);
    }
}
