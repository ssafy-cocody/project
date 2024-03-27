package com.cocodi.codi.domain.repository;

import com.cocodi.clothes.domain.model.Clothes;
import com.cocodi.codi.domain.model.Cody;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CodyRepository extends JpaRepository<Cody, Long> {

    Optional<Cody> findByTopAndBottomAndOuterAndOnepieceAndShoes(Clothes top, Clothes bottom, Clothes outer, Clothes onepiece, Clothes shoes);
}
