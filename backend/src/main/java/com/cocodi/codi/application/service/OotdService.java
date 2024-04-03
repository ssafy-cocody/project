package com.cocodi.codi.application.service;

import com.amazonaws.util.Base64;
import com.cocodi.codi.domain.model.Cody;
import com.cocodi.codi.domain.model.Ootd;
import com.cocodi.codi.domain.repository.CodyRepository;
import com.cocodi.codi.domain.repository.OotdRepository;
import com.cocodi.codi.presentation.request.CodyClothesSearchResponse;
import com.cocodi.codi.presentation.request.OotdCodyRequest;
import com.cocodi.codi.presentation.request.OotdImageRequest;
import com.cocodi.codi.presentation.response.OotdResponse;
import com.cocodi.common.infrastructure.rabbit.util.RabbitMQUtil;
import com.cocodi.member.domain.model.Member;
import com.cocodi.member.domain.repository.MemberRepository;
import com.cocodi.member.infrastructure.exception.MemberFindException;
import com.cocodi.sse.domain.model.SseObject;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class OotdService {

    private final CodyService codyService;
    private final OotdRepository ootdRepository;
    private final MemberRepository memberRepository;
    private final CodyRepository codyRepository;
    private final RabbitMQUtil rabbitMQUtil;

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
        LocalDate date = LocalDate.parse(ootdCreateRequest.date());
        Cody cody = codyRepository.findById(ootdCreateRequest.codyId())
                .orElseThrow(() -> new RuntimeException("Cody not found"));
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberFindException("can not find Member"));
        Optional<Ootd> findOotd = ootdRepository.findByMemberAndDate(member, date);
        Long ootdId = findOotd.map(Ootd::getOotdId).orElse(null);
        Ootd ootd = Ootd.builder()
                .ootdId(ootdId)
                .date(date)
                .cody(cody)
                .member(member)
                .build();
        ootdRepository.save(ootd);
    }

    public void createOotdByImage(OotdImageRequest ootdCreateRequest, String ootdImage, Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberFindException("Cannot find Member"));

        Cody cody = codyService.getCodyFromRequest(ootdCreateRequest.clothesRequest(), null);

        Optional<Ootd> byMemberAndDate = ootdRepository.findByMemberAndDate(member, ootdCreateRequest.date());
        Ootd ootd;
        if(byMemberAndDate.isPresent()) {
            ootd = Ootd.builder()
                    .ootdId(byMemberAndDate.get().getOotdId())
                    .date(ootdCreateRequest.date())
                    .snapShot(ootdImage)
                    .cody(cody)
                    .member(member)
                    .build();
        } else {
            ootd = Ootd.builder()
                    .date(ootdCreateRequest.date())
                    .snapShot(ootdImage)
                    .cody(cody)
                    .member(member)
                    .build();
        }

        ootdRepository.save(ootd);
    }


    public void codyClothesSearch(String sseKey, MultipartFile ootdImage, List<Long> memberCloset) {
        try {
            CodyClothesSearchResponse codyClothesSearchResponse = new CodyClothesSearchResponse(memberCloset, Base64.encodeAsString(ootdImage.getBytes()));
            SseObject sseObject = new SseObject(sseKey, codyClothesSearchResponse);
            rabbitMQUtil.convertAndSend("dhdhxlelzb", "order_direct_exchange", "dhdhxlelzb", sseObject);
        } catch (IOException e) {
            log.info(e.getMessage());

        }
    }
}
