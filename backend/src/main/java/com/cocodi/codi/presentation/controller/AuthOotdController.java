package com.cocodi.codi.presentation.controller;


import com.cocodi.codi.presentation.request.OotdCodyRequest;
import com.cocodi.codi.presentation.request.OotdImageRequest;
import com.cocodi.codi.presentation.response.OotdResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/auth/v1/ootd")
public class AuthOotdController {

    /**
     * 저장된 Ootd 조회 (한 달)
     * @return
     */
    @GetMapping
    public ResponseEntity<List<OotdResponse>> findOotd(@RequestParam int year, @RequestParam int month) {
        return new ResponseEntity<>(null, HttpStatus.OK);
    }

    /**
     * Ootd 사진으로 옷 검색
     * @return
     */
    public ResponseEntity<?> uploadOotdImage() {
        return new ResponseEntity<>(null, HttpStatus.OK);
    }

    /**
     * Ootd 사진으로 등록
     * @param ootdCreateRequest
     * @return null
     */
    @PostMapping("/image")
    public ResponseEntity<?> createOotdByImage(@RequestBody OotdImageRequest ootdCreateRequest) {
        // TODO : 날짜 조회 해서 등록 or 수정
        // TODO : Image에서 옷 정보 뽑아서 코디 검색
        //          -> 코디 있다면 해당 코디 가져와서 저장
        //          -> 코디 없다면 새로운 코디 생성해서 저장
        return new ResponseEntity<>(null, HttpStatus.CREATED);
    }


    /**
     * Ootd 코디로 등록
     * @param ootdCreateRequest
     * @return null
     */
    @PostMapping("/cody")
    public ResponseEntity<?> createOotdByCody(@RequestBody OotdCodyRequest ootdCreateRequest) {
        // TODO : 날짜 조회 해서 등록 or 수정
        // TODO : 코디 아이디 받아와서 저장
        return new ResponseEntity<>(null, HttpStatus.CREATED);
    }

}
