package com.cocodi.member.application.service;

import com.cocodi.aws.application.service.S3Service;
import com.cocodi.member.domain.enums.Authority;
import com.cocodi.member.domain.enums.Gender;
import com.cocodi.member.domain.model.Member;
import com.cocodi.member.domain.repository.MemberRepository;
import com.cocodi.member.infrastructure.exception.MemberFindException;
import com.cocodi.member.presentation.request.MemberUpdateRequest;
import com.cocodi.security.application.service.JwtTokenProvider;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Transactional
public class MemberService {

    private final JwtTokenProvider jwtTokenProvider;
    private final MemberRepository memberRepository;
    private final S3Service s3Service;

    public boolean updateMember(MemberUpdateRequest memberUpdateRequest, Long memberId) {
        Member findMember = memberRepository.findById(memberId).orElseThrow(() -> new MemberFindException("can not find Member"));
        MultipartFile profile = memberUpdateRequest.profile();
        String profileUrl;
        if (profile == null || profile.isEmpty()) {
            profileUrl = findMember.getProfile();
        } else {
            // s3 upload 처리
            profileUrl = s3Service.uploadDefault(profile);
        }
        int year = Integer.parseInt(memberUpdateRequest.birth());
        LocalDate birth = LocalDate.of(year, 1, 1);
        Member member = Member.builder()
                .memberId(memberId)
                .email(findMember.getEmail())
                .birth(birth)
                .gender(Gender.valueOf(memberUpdateRequest.gender()))
                .nickname(memberUpdateRequest.nickname())
                .profile(profileUrl)
                .role(Authority.USER)
                .providerType(findMember.getProviderType())
                .isDeleted(false)
                .createdAt(findMember.getCreatedAt())
                .build();
        Member save = memberRepository.save(member);
        return Objects.equals(findMember.getMemberId(), save.getMemberId());
    }

    public void deleteMember(String token) {
        Long memberId = jwtTokenProvider.getUserId(token);
        Member member = memberRepository.findById(memberId).orElseThrow(() -> new MemberFindException("can not find Member"));
        member.deleteMember();
    }
}
