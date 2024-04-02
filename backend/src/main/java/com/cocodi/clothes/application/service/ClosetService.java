package com.cocodi.clothes.application.service;

import com.cocodi.clothes.domain.repository.ClosetRepository;
import com.cocodi.member.domain.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClosetService {

    private final ClosetRepository closetRepository;
    private final MemberRepository memberRepository;

    public List<Long> findClothesListByMember(Long memberId) {
        return closetRepository.findClothesClothesIdByMemberMemberId(memberId);
    }


}
