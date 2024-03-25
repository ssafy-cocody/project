package com.cocodi.clothes.presentation.controlloer;

import com.cocodi.clothes.application.service.ClothesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/public/v1/clothes")
public class PublicClothesController {

    private final ClothesService clothesService;
    @GetMapping("/temp/{uuid}")
    public ResponseEntity<byte[]> getTempImg(@PathVariable String uuid) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG);
        return ResponseEntity.ok().headers(headers).body(clothesService.getTempImg(uuid));
    }
}
