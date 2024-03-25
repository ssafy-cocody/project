package com.cocodi.security.presentation.response;

import com.cocodi.member.domain.enums.Authority;

public record MemberInfo(
        String nickname, Authority role
) {
}
