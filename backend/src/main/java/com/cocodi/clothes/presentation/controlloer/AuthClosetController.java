package com.cocodi.clothes.presentation.controlloer;

import com.cocodi.clothes.application.service.ClosetService;
import com.cocodi.clothes.domain.model.Category;
import com.cocodi.clothes.domain.model.Closet;
import com.cocodi.clothes.domain.model.Clothes;
import com.cocodi.clothes.presentation.request.ClosetCreateRequest;
import com.cocodi.clothes.presentation.response.ClosetResponse;
import com.cocodi.clothes.presentation.response.ClothesResponse;
import com.cocodi.security.domain.model.PrincipalDetails;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/auth/v1/closet")
@RequiredArgsConstructor
public class AuthClosetController {
    private final ObjectMapper objectMapper;
    private final ClosetService closetService;

    private ClothesResponse convertToResponse(Clothes clothes) {
        return objectMapper.convertValue(clothes, ClothesResponse.class);
    }

    @DeleteMapping
    public ResponseEntity<?> deleteCloset(@RequestBody ClosetCreateRequest createRequest) {
        closetService.deleteCloset(createRequest.clothesId(), createRequest.memberId());
        return ResponseEntity.ok().build();
    }

    @PostMapping
    public ResponseEntity<ClosetResponse> createCloset(@RequestBody ClosetCreateRequest createRequest) {
        Closet closet = closetService.createCloset(createRequest.clothesId(), createRequest.memberId());
        ClosetResponse closetResponse = new ClosetResponse(closet.getClosetId(), closet.getMember().getMemberId(), closet.getClothes().getClothesId());
        return ResponseEntity.ok(closetResponse);
    }

    /**
     * 옷장에 저장된 전체 옷 조회
     *
     * @param pageable
     * @param category
     * @return
     */
    @GetMapping
    public ResponseEntity<Slice<ClothesResponse>> findClothes(Pageable pageable, @RequestParam("category") Category category, @AuthenticationPrincipal PrincipalDetails principalDetails) {
        List<ClothesResponse> clothesList = closetService.findClothesBy_MemberAndCategory(principalDetails.getMemberId(), category, pageable)
                .stream().map(this::convertToResponse).toList();

        boolean hasNext = clothesList.size() > pageable.getPageSize();
        List<ClothesResponse> slicedContent = hasNext ? clothesList.subList(0, pageable.getPageSize()) : clothesList;

        return new ResponseEntity<>(new SliceImpl<>(slicedContent, pageable, hasNext), HttpStatus.OK);
    }

}
