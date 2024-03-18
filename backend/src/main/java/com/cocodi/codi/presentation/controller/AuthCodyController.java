package com.cocodi.codi.presentation.controller;

import com.cocodi.codi.presentation.request.CodyCreateRequest;
import com.cocodi.codi.presentation.response.CodyResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth/v1/cody")
public class AuthCodyController {

    /**
     * 저장된 코디 리스트 조회
     * @param pageable
     * @return
     */
    @GetMapping
    public ResponseEntity<Page<CodyResponse>> findCody(@RequestBody Pageable pageable) {
        return new ResponseEntity<>(null, HttpStatus.OK);
    }

    /**
     * 코디 상세 조회
     * @return
     */
    @GetMapping("/{codyId}")
    public ResponseEntity<CodyResponse> findCodyById(@PathVariable Long codyId) {
        return new ResponseEntity<>(null, HttpStatus.OK);
    }


    /**
     * 코디 등록
     * @param codyCreateRequest
     * @return null
     */
    @PostMapping
    public ResponseEntity<?> createCody(@RequestBody CodyCreateRequest codyCreateRequest) {
        // 코디 등록 전 (상의, 하의, 원피스, 아우터, 신발)기준으로 기존 코디 검색 필요
        return new ResponseEntity<>(null, HttpStatus.CREATED);
    }

    /**
     * 코디 삭제
     * @return null
     */
    @DeleteMapping("/{codyId}")
    public ResponseEntity<?> deleteCody(@PathVariable Long codyId) {
        return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
    }

    /**
     *
     * @param date
     * @return
     */
    @GetMapping("/recommend/cody")
    public ResponseEntity<?> getRecommendCodyList(String date) {
        // 추천 코디 갯수가 여러개(3~6개)
        return new ResponseEntity<>(null, HttpStatus.OK);
    }

    /**
     *
     * @return
     */
    @GetMapping("/recommend/item")
    public ResponseEntity<?> getRecommendItemList() {
        return new ResponseEntity<>(null, HttpStatus.OK);
    }

}
