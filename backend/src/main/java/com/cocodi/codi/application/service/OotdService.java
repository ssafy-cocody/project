package com.cocodi.codi.application.service;

import com.cocodi.codi.domain.model.Ootd;
import com.cocodi.codi.domain.repository.OotdRepository;
import com.cocodi.security.application.service.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OotdService {

    private final OotdRepository ootdRepository;
    private final JwtTokenProvider jwtTokenProvider;

    public void findOotd(int year, int month, Long memberId) {
        LocalDate startDate = LocalDate.now();
        LocalDate endDate = LocalDate.now();
        List<Ootd> ootds = ootdRepository.findByDateBetween(startDate, endDate);
    }
}
