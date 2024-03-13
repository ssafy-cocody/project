package com.cocodi.member.presentation.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/public/v1/member")
public class NonAuthMemberController {
    public String example() {
        return "Hello Swagger!";
    }

}
