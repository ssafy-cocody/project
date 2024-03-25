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
     * @param memberUpdateRequest
     * @param profile
     * @param principalDetails
     * @return
     */
    @PatchMapping
    public ResponseEntity<String> updateMember(@RequestBody MemberUpdateRequest memberUpdateRequest, MultipartFile profile, @AuthenticationPrincipal PrincipalDetails principalDetails) {
        if(memberService.updateMember(memberUpdateRequest, profile, principalDetails.getMemberId())) {
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
