package com.cocodi.clothes;

import com.cocodi.clothes.domain.model.Category;
import com.cocodi.clothes.infrastructure.persistance.ClosetCustomRepositoryImpl;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("dev")
public class ClothesCustomTest {

    @Autowired
    private ClosetCustomRepositoryImpl clothesCustomRepository;

    @Test
    void test() {
        clothesCustomRepository.findClothesBy_MemberAndCategory(1L, Category.BOTTOM, PageRequest.of(0, 10));
    }
}
