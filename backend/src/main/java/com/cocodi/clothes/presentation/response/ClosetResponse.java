package com.cocodi.clothes.presentation.response;

public record ClosetResponse(
        Long closetId,
        Long memberId,

        Long clothesId
) {
}
