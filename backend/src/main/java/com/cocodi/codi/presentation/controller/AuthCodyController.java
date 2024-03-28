package com.cocodi.codi.presentation.controller;

import com.cocodi.codi.application.service.CodyService;
import com.cocodi.codi.presentation.request.CodyCreateRequest;
import com.cocodi.codi.presentation.response.CodyResponse;
import com.cocodi.security.domain.model.PrincipalDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/auth/v1/cody")
@RequiredArgsConstructor
public class AuthCodyController {

    private final CodyService codyService;

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
        // todo 페이지네이션 수정
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
        if (codyService.createCody(codyCreateRequest, principalDetails.getMemberId())) {
            return new ResponseEntity<>("success", HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>("이미 등록된 코디입니다.", HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * 코디 삭제
     *
     * @return null
     */
    @DeleteMapping("/{codyId}")
    public ResponseEntity<?> deleteMyCody(@PathVariable Long codyId, @AuthenticationPrincipal PrincipalDetails principalDetails) {
        codyService.deleteMyCody(codyId, principalDetails.getMemberId());
        return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
    }

    /**
     * @param date
     * @return
     */
    @GetMapping("/recommend/cody")
    public ResponseEntity<?> getRecommendCodyList(String date) {
        // 추천 코디 갯수가 여러개(3~6개)
        return new ResponseEntity<>(null, HttpStatus.OK);
    }

    /**
     * @return
     */
    @GetMapping("/recommend/item")
    public ResponseEntity<?> getRecommendItemList() {
        return new ResponseEntity<>(null, HttpStatus.OK);
    }

}
