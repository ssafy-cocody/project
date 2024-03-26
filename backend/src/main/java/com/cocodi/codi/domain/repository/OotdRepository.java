package com.cocodi.codi.domain.repository;

import com.cocodi.codi.domain.model.Ootd;
import com.cocodi.member.domain.model.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface OotdRepository extends JpaRepository<Ootd, Long> {

    List<Ootd> findByMemberAndDateBetween(Member member, LocalDate startDate, LocalDate endDate);

    Optional<Ootd> findByDate(LocalDate date);
}
