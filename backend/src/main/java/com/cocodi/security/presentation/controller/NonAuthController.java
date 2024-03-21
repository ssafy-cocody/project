package com.cocodi.security.presentation.controller;

import com.cocodi.security.application.service.JwtTokenProvider;
import com.cocodi.security.application.service.NonAuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/public")
@RequiredArgsConstructor
public class NonAuthController {

    private final NonAuthService nonAuthService;
    private final JwtTokenProvider jwtTokenProvider;
    @GetMapping
    public ResponseEntity<String> getAccessToken(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        try {
            for (Cookie cookie : cookies) {
                if ("refreshToken".equals(cookie.getName())) {
                    String refreshToken = cookie.getValue();
                    if(jwtTokenProvider.validateToken(refreshToken)) {
                        String accessToken = nonAuthService.getAccessToken(cookie.getValue());
                        HttpHeaders headers = new HttpHeaders();
                        headers.add(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken);
                        return ResponseEntity.ok().headers(headers).build();
                    } else {
                        break;
                    }
                }
            }
        } catch (Exception ignore) {
            return new ResponseEntity<>("Bad Request", HttpStatus.UNAUTHORIZED);
        }
        return new ResponseEntity<>("Bad Gateway", HttpStatus.BAD_GATEWAY);
    }

}
