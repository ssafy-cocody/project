package com.cocodi.security.presentation.controller;

import com.cocodi.security.application.service.JwtTokenProvider;
import com.cocodi.security.application.service.NonAuthService;
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
    public ResponseEntity<String> getAccessToken(HttpServletRequest request) {

        try {
            Cookie[] cookies = request.getCookies();
            for (Cookie cookie : cookies) {
                if ("refreshToken".equals(cookie.getName())) {
                    String refreshToken = cookie.getValue();
                    log.info("refreshToken={}" ,refreshToken);
                    if(jwtTokenProvider.validateToken(refreshToken)) {
                        String accessToken = nonAuthService.getAccessToken(refreshToken);
                        HttpHeaders headers = new HttpHeaders();
                        headers.add(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken);
                        String nickname = nonAuthService.getNickname(accessToken);
                        return new ResponseEntity<>(nickname, headers, HttpStatus.OK);
                    } else {
                        break;
                    }
                }
            }
        } catch (Exception e) {
            log.error(e.getMessage());
            return new ResponseEntity<>("Bad Request", HttpStatus.UNAUTHORIZED);
        }
        return new ResponseEntity<>("Bad Gateway", HttpStatus.BAD_GATEWAY);
    }

}
