package com.cocodi.member.presentation.request;

import org.springframework.web.multipart.MultipartFile;

public record MemberUpdateRequest(String gender, String birth, String nickname, MultipartFile profile) {

}
