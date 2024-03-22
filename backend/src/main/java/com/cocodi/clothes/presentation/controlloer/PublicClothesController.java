package com.cocodi.clothes.presentation.controlloer;

import com.cocodi.clothes.application.service.ClothesService;
import com.cocodi.clothes.presentation.request.ClothesCreateRequest;
import com.cocodi.clothes.presentation.response.ClothesResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/public/v1/clothes")
public class PublicClothesController {

    private final ClothesService clothesService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostMapping
    ResponseEntity<ClothesResponse> createClothes(@ModelAttribute ClothesCreateRequest clothesCreateRequest) {
        ClothesResponse clothesResponse = objectMapper.convertValue(clothesService.createClothes(clothesCreateRequest), ClothesResponse.class);
        return ResponseEntity.ok(clothesResponse);
    }
}
