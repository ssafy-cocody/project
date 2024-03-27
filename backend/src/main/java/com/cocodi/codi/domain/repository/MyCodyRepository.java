package com.cocodi.codi.domain.repository;

import com.cocodi.codi.domain.model.Cody;
import com.cocodi.codi.domain.model.MyCody;
import com.cocodi.member.domain.model.Member;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MyCodyRepository extends JpaRepository<MyCody, Long> {

    Slice<MyCody> findMyCodiesByMember(Member member, Pageable pageable);

    Optional<MyCody> findByMemberAndCody(Member member, Cody cody);

    Long countByMyCodiIdGreaterThan(Long myCodyId);
}
