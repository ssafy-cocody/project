package com.cocodi.clothes.presentation.controlloer;

import com.cocodi.clothes.application.service.ClothesService;
import com.cocodi.clothes.domain.model.Clothes;
import com.cocodi.clothes.presentation.request.ClothesCreateRequest;
import com.cocodi.clothes.presentation.response.ClothesResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/public/v1/clothes")
public class PublicClothesController {

    private final ClothesService clothesService;
    private final ObjectMapper objectMapper;

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
}
