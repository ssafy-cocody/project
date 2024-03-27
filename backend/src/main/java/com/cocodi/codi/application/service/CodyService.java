package com.cocodi.codi.application.service;

import com.cocodi.clothes.domain.model.Clothes;
import com.cocodi.clothes.domain.repository.ClothesRepository;
import com.cocodi.codi.domain.model.Cody;
import com.cocodi.codi.domain.model.MyCody;
import com.cocodi.codi.domain.repository.CodyRepository;
import com.cocodi.codi.domain.repository.MyCodyRepository;
import com.cocodi.codi.presentation.request.ClothesRequest;
import com.cocodi.codi.presentation.request.CodyCreateRequest;
import com.cocodi.codi.presentation.response.CodyResponse;
import com.cocodi.member.domain.model.Member;
import com.cocodi.member.domain.repository.MemberRepository;
import com.cocodi.member.infrastructure.exception.MemberFindException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CodyService {

    private final MyCodyRepository myCodyRepository;
    private final CodyRepository codyRepository;
    private final MemberRepository memberRepository;
    private final ClothesRepository clothesRepository;

    public Slice<CodyResponse> findCody(Pageable pageable, Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberFindException("Cannot find Member"));
        Slice<MyCody> myCodies = myCodyRepository.findMyCodiesByMember(member, pageable);
        List<CodyResponse> codyResponses = myCodies.stream()
                .map(myCody -> new CodyResponse(myCody.getMyCodiId(), myCody.getCody().getCodiId(), myCody.getName(), myCody.getCody().getImage()))
                .toList();
        Long lastMyCodyId = codyResponses.get(codyResponses.size() - 1).myCodyId();
        boolean hasNext = myCodyRepository.countByMyCodiIdGreaterThan(lastMyCodyId) > 0;
        return new SliceImpl<>(codyResponses, pageable, hasNext);

    }

    public boolean createCody(CodyCreateRequest codyCreateRequest, Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberFindException("Cannot find Member"));
        Cody cody = getCodyFromRequest(codyCreateRequest.clothesRequest());
        Optional<MyCody> findMyCody = myCodyRepository.findByMemberAndCody(member, cody);
        if (findMyCody.isPresent()) {
            return false;
        }
        MyCody myCody = MyCody.builder()
                .name(codyCreateRequest.name())
                .cody(cody)
                .member(member)
                .build();
        myCodyRepository.save(myCody);
        // todo : 이미지 생성
        return true;
    }

    public Cody getCodyFromRequest(ClothesRequest clothesRequest) {
        return codyRepository.findByTopAndBottomAndOuterAndOnepieceAndShoes(
                getClothesOrNull(clothesRequest.topId()),
                getClothesOrNull(clothesRequest.bottomId()),
                getClothesOrNull(clothesRequest.outerId()),
                getClothesOrNull(clothesRequest.onepieceId()),
                getClothesOrNull(clothesRequest.shoesId())
        ).orElseGet(() -> {
            Cody cody = Cody.builder()
                    .top(getClothesOrNull(clothesRequest.topId()))
                    .bottom(getClothesOrNull(clothesRequest.bottomId()))
                    .outer(getClothesOrNull(clothesRequest.outerId()))
                    .onepiece(getClothesOrNull(clothesRequest.onepieceId()))
                    .shoes(getClothesOrNull(clothesRequest.shoesId()))
                    .build();
            return codyRepository.save(cody);
        });
    }

    public void deleteMyCody(Long codyId, Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberFindException("Cannot find Member"));
        Cody cody = codyRepository.findById(codyId)
                .orElseThrow(() -> new RuntimeException("Cannot find Cody"));
        MyCody myCody = myCodyRepository.findByMemberAndCody(member, cody)
                .orElseThrow(() -> new RuntimeException("Cannot find MyCody"));
        myCodyRepository.delete(myCody);
    }

    private Clothes getClothesOrNull(Long clothesId) {
        return clothesId != null ? clothesRepository.findById(clothesId).orElse(null) : null;
    }

}
