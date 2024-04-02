package com.cocodi.security.presentation.response;

import com.cocodi.member.domain.enums.Authority;
import com.cocodi.member.domain.enums.Gender;

public record MemberInfo(
        String nickname, Authority role, String birth, Gender gender, String profile
) {
}
