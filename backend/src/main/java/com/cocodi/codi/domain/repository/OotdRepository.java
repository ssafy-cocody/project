package com.cocodi.codi.domain.repository;

import com.cocodi.codi.domain.model.Ootd;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface OotdRepository extends JpaRepository<Ootd, Long> {

    List<Ootd> findByDateBetween(LocalDate startDate, LocalDate endDate);

}
