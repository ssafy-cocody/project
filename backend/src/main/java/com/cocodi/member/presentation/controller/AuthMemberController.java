package com.cocodi.member.presentation.controller;

import com.cocodi.member.application.service.MemberService;
import com.cocodi.member.presentation.request.MemberUpdateRequest;
import com.cocodi.security.domain.model.PrincipalDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/auth/v1/member")
@RequiredArgsConstructor
public class AuthMemberController {
    private final MemberService memberService;


    /**
     * 회원 정보 수정
     * @param principalDetails
     * @return
     */
    @PatchMapping
    public ResponseEntity<String> updateMember(@RequestParam(required = false) String gender, @RequestParam(required = false) String birth, @RequestParam(required = false) String nickname, @RequestParam(required = false) MultipartFile profile, @AuthenticationPrincipal PrincipalDetails principalDetails) {
        MemberUpdateRequest memberUpdateRequest = new MemberUpdateRequest(gender, birth, nickname, profile);
        if(memberService.updateMember(memberUpdateRequest, principalDetails.getMemberId())) {
            return new ResponseEntity<>("success", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("fail", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 회원 탈퇴
     * @return null
     */
    @DeleteMapping
    public ResponseEntity<?> deleteMember(@RequestHeader("Authorization") String token) {
        memberService.deleteMember(token);
        return new ResponseEntity<>("success", HttpStatus.NO_CONTENT);
    }
}
