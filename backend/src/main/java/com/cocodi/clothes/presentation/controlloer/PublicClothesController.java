package com.cocodi.clothes.presentation.controlloer;

import com.cocodi.clothes.application.service.ClothesService;
import com.cocodi.clothes.domain.model.Clothes;
import com.cocodi.clothes.presentation.request.ClothesCreateRequest;
import com.cocodi.clothes.presentation.response.ClothesResponse;
import com.cocodi.sse.application.service.SseService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequiredArgsConstructor
@RequestMapping("/public/v1/clothes")
public class PublicClothesController {

    private final ClothesService clothesService;
    private final ObjectMapper objectMapper;
    private final SseService sseService;

    @GetMapping("/temp/{uuid}")
    public ResponseEntity<byte[]> getTempImg(@PathVariable String uuid) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG);
        return ResponseEntity.ok().headers(headers).body(clothesService.getTempImg(uuid));
    }

    @PostMapping
    public ResponseEntity<?> createImg(@ModelAttribute ClothesCreateRequest clothesCreateRequest) {
        Clothes clothes = clothesService.createClothes(clothesCreateRequest);
        ClothesResponse clothesResponse = objectMapper.convertValue(clothes, ClothesResponse.class);
        return ResponseEntity.ok(clothesResponse);
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

}
