package com.cocodi.clothes.presentation.controlloer;

import com.cocodi.clothes.application.service.ClothesService;
import com.cocodi.clothes.domain.model.Category;
import com.cocodi.clothes.presentation.request.ClothesCreateRequest;
import com.cocodi.clothes.presentation.response.ClothesResponse;
import com.cocodi.sse.application.service.SseService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

@RestController
@RequestMapping("/auth/v1/clothes")
@RequiredArgsConstructor
public class AuthClothesController {

    private final ClothesService clothesService;
    private final SseService sseService;

    /**
     * 옷장에 저장된 전체 옷 조회
     * @param pageable
     * @param category
     * @return
     */
    @GetMapping
    public ResponseEntity<PageImpl<ClothesResponse>> findClothes(@RequestBody Pageable pageable, @RequestParam Category category) {
        return new ResponseEntity<>(null, HttpStatus.OK);
    }

    /**
     * 옷 정보 등록
     * @param clothesCreateRequest
     * @return null
     */
    @PostMapping
    public ResponseEntity<?> createClothes(@RequestBody ClothesCreateRequest clothesCreateRequest) {
        return new ResponseEntity<>(null, HttpStatus.CREATED);
    }

    /**
     * 옷 삭제
     * @return null
     */
    @DeleteMapping
    public ResponseEntity<?> deleteClothes() {
        return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
    }

    /**
     * 사용자가 옷 검색을 위해 이미지 업로드
     * @return
     */
    @PostMapping("/image")
    public SseEmitter searchClothesByImage(MultipartFile multipartFile) {
        // Redis에 이미지 임시저장 Expired Time 30m
        // TODO : 의류 검색 결과 Server Sent Event 처리
        String sseKey = sseService.createInstance();
        clothesService.imageConvert(multipartFile, sseKey);
        return sseService.getInstance(sseKey);
    }

    /**
     * 품번으로 검색
     * @return
     */
    @GetMapping("/{productNo}")
    public ResponseEntity<List<ClothesResponse>> searchClothesByProductNo(@PathVariable String productNo) {
        // 한 품번에 대해 여러 색이 있을 때 대비하여 리스트 반환
        // ex) [A-노랑, A-검정, A-흰색]
        // TODO : color 컬럼 정규화 고민 필요
        return new ResponseEntity<>(null, HttpStatus.OK);
    }

    @GetMapping("/temp/{uuid}")
    public ResponseEntity<byte[]> getTempImg(@PathVariable String uuid) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG);
        return ResponseEntity.ok().headers(headers).body(clothesService.getTempImg(uuid));
    }
}
