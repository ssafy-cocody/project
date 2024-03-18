package com.cocodi.member.presentation.controller;

import com.cocodi.member.presentation.request.MemberUpdateRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth/v1/member")
public class AuthMemberController {

    /**
     * 회원 정보 수정
     * @param memberUpdateRequest
     * @return null
     */
    @PatchMapping
    public ResponseEntity<?> updateMember(@RequestBody MemberUpdateRequest memberUpdateRequest) {
        return new ResponseEntity<>(null, HttpStatus.OK);
    }

    /**
     * 회원 탈퇴
     * @return null
     */
    @DeleteMapping
    public ResponseEntity<?> deleteMember() {
        return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
    }
}
