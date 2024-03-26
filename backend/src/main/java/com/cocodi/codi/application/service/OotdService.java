package com.cocodi.codi.application.service;

import com.cocodi.clothes.domain.model.Clothes;
import com.cocodi.clothes.domain.repository.ClothesRepository;
import com.cocodi.codi.domain.model.Cody;
import com.cocodi.codi.domain.model.Ootd;
import com.cocodi.codi.domain.repository.CodyRepository;
import com.cocodi.codi.domain.repository.OotdRepository;
import com.cocodi.codi.presentation.request.OotdCodyRequest;
import com.cocodi.codi.presentation.request.OotdImageRequest;
import com.cocodi.codi.presentation.response.OotdResponse;
import com.cocodi.member.domain.model.Member;
import com.cocodi.member.domain.repository.MemberRepository;
import com.cocodi.member.infrastructure.exception.MemberFindException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OotdService {

    private final OotdRepository ootdRepository;
    private final MemberRepository memberRepository;
    private final CodyRepository codyRepository;
    private final ClothesRepository clothesRepository;

    public List<OotdResponse> findOotd(int year, int month, Long memberId) {
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();
        Member member = memberRepository.findById(memberId).orElseThrow(() -> new MemberFindException("can not find Member"));
        return ootdRepository.findByMemberAndDateBetween(member, startDate, endDate).stream()
                .map(ootd -> new OotdResponse(ootd.getOotdId(), ootd.getDate().getDayOfMonth(), ootd.getCody().getImage()))
                .toList();
    }

    public void createOotdByCody(OotdCodyRequest ootdCreateRequest, Long memberId) {
        Cody cody = codyRepository.findById(ootdCreateRequest.codyId())
                .orElseThrow(() -> new RuntimeException("Cody not found"));
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberFindException("can not find Member"));
        Optional<Ootd> findOotd = ootdRepository.findByDate(ootdCreateRequest.date());
        Long ootdId = findOotd.map(Ootd::getOotdId).orElse(null);
        Ootd ootd = Ootd.builder()
                .ootdId(ootdId)
                .date(ootdCreateRequest.date())
                .cody(cody)
                .member(member)
                .build();
        ootdRepository.save(ootd);
    }

    public void createOotdByImage(OotdImageRequest ootdCreateRequest, String ootdImage, Long memberId) {
        Member member = memberRepository.findById(memberId).orElseThrow(() -> new MemberFindException("can not find Member"));
        Clothes top = clothesRepository.findById(ootdCreateRequest.topId()).orElse(null);
        Clothes bottom = clothesRepository.findById(ootdCreateRequest.bottomId()).orElse(null);
        Clothes outer = clothesRepository.findById(ootdCreateRequest.outerId()).orElse(null);
        Clothes shoes = clothesRepository.findById(ootdCreateRequest.shoesId()).orElse(null);
        Optional<Cody> findCody = codyRepository.findByTopAndBottomAndOuterAndShoes(top, bottom, outer, shoes);
        Cody cody;
        if(findCody.isEmpty()) {
            cody = Cody.builder()
                    .top(top)
                    .bottom(bottom)
                    .outer(outer)
                    .shoes(shoes)
                    .build();
            codyRepository.save(cody);
        } else {
            cody = findCody.get();
        }
        Optional<Ootd> findOotd = ootdRepository.findByDate(ootdCreateRequest.date());
        Long ootdId = findOotd.map(Ootd::getOotdId).orElse(null);
        Ootd ootd = Ootd.builder()
                .ootdId(ootdId)
                .date(ootdCreateRequest.date())
                .snapShot(ootdImage)
                .cody(cody)
                .member(member)
                .build();
        ootdRepository.save(ootd);
    }
}
