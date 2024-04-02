package com.cocodi.codi.domain.repository;

import com.cocodi.codi.domain.model.RecommendCodyKey;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RecommendCodyKeyRepository extends CrudRepository<RecommendCodyKey, String> {
    RecommendCodyKey findBySseKey(String sseKey);
}