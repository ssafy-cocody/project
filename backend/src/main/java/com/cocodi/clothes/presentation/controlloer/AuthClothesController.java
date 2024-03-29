package com.cocodi.clothes.presentation.controlloer;

import com.cocodi.clothes.application.service.ClothesService;
import com.cocodi.clothes.domain.model.Clothes;
import com.cocodi.clothes.presentation.request.ClothesCreateRequest;
import com.cocodi.clothes.presentation.response.ClothesResponse;
import com.cocodi.security.domain.model.PrincipalDetails;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/auth/v1/clothes")
@RequiredArgsConstructor
@Slf4j
public class AuthClothesController {

    private final ClothesService clothesService;
    private final ObjectMapper objectMapper;

    private ClothesResponse convertToResponse(Clothes clothes) {
        return objectMapper.convertValue(clothes, ClothesResponse.class);
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
     * 품번으로 검색
     * @return
     */
    @GetMapping("/{productNo}")
    public ResponseEntity<List<ClothesResponse>> searchClothesByProductNo(@PathVariable String productNo) {
        List<ClothesResponse> clothesResponseList = clothesService.findClothesListByProductNo(productNo).stream().map(
                clothes -> objectMapper.convertValue(clothes, ClothesResponse.class)).toList();
        return new ResponseEntity<>(clothesResponseList, HttpStatus.OK);
    }

    @GetMapping("/temp/img/{uuid}")
    public ResponseEntity<byte[]> getTempImg(@PathVariable String uuid) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG);
        return ResponseEntity.ok().headers(headers).body(clothesService.getTempImg(uuid));
    }

    @GetMapping("/temp/info/{uuid}")
    public ResponseEntity<List<ClothesResponse>> getTempInfo(@PathVariable String uuid) {
        List<Clothes> clothesList = clothesService.findClothesTempList(uuid);
        List<ClothesResponse> clothesResponseList = clothesList.stream().map(this::convertToResponse).toList();
        return ResponseEntity.ok(clothesResponseList);
    }

    @PostMapping("/temp/save/{uuid}")
    public ResponseEntity<ClothesResponse> createTempInfo(@PathVariable String uuid, @ModelAttribute ClothesCreateRequest clothesCreateRequest, @AuthenticationPrincipal PrincipalDetails principalDetails) {
        Clothes clothes = clothesService.createClothesTemp(uuid, clothesCreateRequest, principalDetails.getMemberId());
        return ResponseEntity.ok(objectMapper.convertValue(clothes, ClothesResponse.class));
    }
}
