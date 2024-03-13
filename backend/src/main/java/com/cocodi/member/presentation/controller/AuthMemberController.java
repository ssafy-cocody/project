package com.cocodi.member.presentation.controller;

import com.cocodi.member.presentation.request.MemberUpdateRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth/v1/member")
public class AuthMemberController {

    @PatchMapping
    public ResponseEntity<?> updateMember(@RequestBody MemberUpdateRequest memberUpdateRequest) {

        return new ResponseEntity<>(null, HttpStatus.OK);
    }



}
