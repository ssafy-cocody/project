package com.cocodi.codi.presentation.controller;


import com.cocodi.codi.application.service.OotdService;
import com.cocodi.codi.presentation.request.OotdCodyRequest;
import com.cocodi.codi.presentation.request.OotdImageRequest;
import com.cocodi.codi.presentation.response.ImageSearchResponse;
import com.cocodi.codi.presentation.response.OotdResponse;
import com.cocodi.security.domain.model.PrincipalDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/auth/v1/ootd")
@RequiredArgsConstructor
public class AuthOotdController {

    private final OotdService ootdService;

    /**
     * 저장된 Ootd 조회 (한 달)
     * @return
     */
    @GetMapping
    public ResponseEntity<List<OotdResponse>> findOotd(@RequestParam int year, @RequestParam int month, @AuthenticationPrincipal PrincipalDetails principalDetails) {
        List<OotdResponse> ootd = ootdService.findOotd(year, month, principalDetails.getMemberId());
        return new ResponseEntity<>(ootd, HttpStatus.OK);
    }

    /**
     * Ootd 사진으로 옷 검색
     * @return
     */
    @GetMapping("/image")
    public ResponseEntity<ImageSearchResponse> uploadOotdImage(MultipartFile ootdImage) {
        // todo 파이썬한테 이미지 전달
        // todo 상의, 하의, 신발, 아우터 정보 반환 받기
        // 프론트에 전달
        ImageSearchResponse imageSearchResponse = new ImageSearchResponse(null, null, null, null);
        return new ResponseEntity<>(imageSearchResponse, HttpStatus.OK);
    }

    /**
     * Ootd 사진으로 등록
     * @param ootdCreateRequest
     * @return null
     */
    @PostMapping("/image")
    public ResponseEntity<?> createOotdByImage(@RequestBody OotdImageRequest ootdCreateRequest, MultipartFile ootdImage, @AuthenticationPrincipal PrincipalDetails principalDetails) {
        // TODO : s3 image upload
        ootdService.createOotdByImage(ootdCreateRequest, "ootdImage", principalDetails.getMemberId());
        // TODO : 날짜 조회 해서 등록 or 수정
        // TODO : Image에서 옷 정보 뽑아서 코디 검색
        //          -> 코디 있다면 해당 코디 가져와서 저장
        //          -> 코디 없다면 새로운 코디 생성해서 저장
        return new ResponseEntity<>("success", HttpStatus.CREATED);
    }


    /**
     * Ootd 코디로 등록
     * @param ootdCreateRequest
     * @param principalDetails
     * @return
     */
    @PostMapping("/cody")
    public ResponseEntity<String> createOotdByCody(@RequestBody OotdCodyRequest ootdCreateRequest, @AuthenticationPrincipal PrincipalDetails principalDetails) {
        ootdService.createOotdByCody(ootdCreateRequest, principalDetails.getMemberId());
        return new ResponseEntity<>("success", HttpStatus.CREATED);
    }

}
