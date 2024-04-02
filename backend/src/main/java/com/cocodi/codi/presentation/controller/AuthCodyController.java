package com.cocodi.codi.presentation.controller;

import com.cocodi.clothes.application.service.ClosetService;
import com.cocodi.codi.application.service.CodyService;
import com.cocodi.codi.presentation.request.CodyCreateRequest;
import com.cocodi.codi.presentation.response.CodyResponse;
import com.cocodi.security.domain.model.PrincipalDetails;
import com.cocodi.sse.application.service.SseService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/auth/v1/cody")
@RequiredArgsConstructor
public class AuthCodyController {

    private final CodyService codyService;
    private final ClosetService closetService;
    private final SseService sseService;

    /**
     * 저장된 코디 리스트 조회
     *
     * @param page
     * @param size
     * @param principalDetails
     * @return
     */
    @GetMapping
    public ResponseEntity<Slice<CodyResponse>> findCody(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size,
            @AuthenticationPrincipal PrincipalDetails principalDetails) {
        Pageable pageable = PageRequest.of(page, size);
        Slice<CodyResponse> codys = codyService.findCody(pageable, principalDetails.getMemberId());
        return new ResponseEntity<>(codys, HttpStatus.OK);
    }

    /**
     * 코디 등록
     *
     * @param codyCreateRequest
     * @return null
     */
    @PostMapping
    public ResponseEntity<?> createCody(@RequestBody CodyCreateRequest codyCreateRequest, @AuthenticationPrincipal PrincipalDetails principalDetails) {
        String sseKey = sseService.createInstance();
        if (codyService.createCody(codyCreateRequest, principalDetails.getMemberId(), sseKey)) {
            codyService.createCodyImage(codyCreateRequest.clothesPythonRequest(), sseKey);
            return ResponseEntity.ok().build();
        }
        throw new RuntimeException("already exist cody :" + "AuthCodyController.createCody");
    }

    /**
     * 코디 삭제
     *
     * @return null
     */
    @DeleteMapping("/{myCodyId}")
    public ResponseEntity<?> deleteMyCody(@PathVariable Long myCodyId, @AuthenticationPrincipal PrincipalDetails principalDetails) {
        codyService.deleteMyCody(myCodyId, principalDetails.getMemberId());
        return new ResponseEntity<>("success", HttpStatus.NO_CONTENT);
    }

    /**
     * @param date
     * @return
     */
    @GetMapping("/recommend/cody")
    public SseEmitter getRecommendCodyList(@RequestParam Integer temp, @RequestParam LocalDate date, @AuthenticationPrincipal PrincipalDetails principalDetails) {
        Long memberId = principalDetails.getMemberId();
        // 추천 코디 갯수가 여러개(3~6개)
        // 파이썬에 사용자 옷장 정보 넘기기(clothesId)
        List<Long> memberCloset = closetService.findClothesListByMember(memberId);
        String sseKey = sseService.createInstance();
        codyService.getRecommendCodyList(temp, memberCloset, sseKey);
        // redis 에 사용자의 id와 날짜 저장
        codyService.saveIdAndDate(memberId, date, sseKey);

        return sseService.getInstance(sseKey);
    }

    /**
     * @return
     */
    @GetMapping("/recommend/item")
    public ResponseEntity<?> getRecommendItemList(@RequestParam Integer temp, @AuthenticationPrincipal PrincipalDetails principalDetails) {
        Long memberId = principalDetails.getMemberId();
        String sseKey = sseService.createInstance();
        // 파이썬에 사용자 옷장 정보 넘기기(clothesId)
        List<Long> memberCloset = closetService.findClothesListByMember(memberId);
        codyService.getRecommendItemList(memberCloset, memberId, temp, sseKey);

        return new ResponseEntity<>(null, HttpStatus.OK);
    }

//    @GetMapping("/home")
//    public ResponseEntity<?> getHomeInfo(@RequestParam Integer temp, @RequestParam LocalDate date, @RequestParam(defaultValue = "0") int page,
//                                         @RequestParam(defaultValue = "8") int size, @AuthenticationPrincipal PrincipalDetails principalDetails) {
//        // 추천받은 코디 리스트
//
//        // 추천받은 아이템 리스트
//
//        // 사용자 코디 리스트
//        Pageable pageable = PageRequest.of(page, size);
//        Slice<CodyResponse> codys = codyService.findCody(pageable, principalDetails.getMemberId());
//
//        HomeResponse homeResponse = new HomeResponse(null, null, codys);
//
//        return new ResponseEntity<>(homeResponse, HttpStatus.OK);
//    }

}
