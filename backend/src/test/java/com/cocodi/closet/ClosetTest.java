package com.cocodi.closet;

import com.cocodi.clothes.application.service.ClosetService;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
@ActiveProfiles("dev")
public class ClosetTest {
    private static final Logger logger = LoggerFactory.getLogger(ClosetTest.class);

    @Autowired
    private ClosetService closetService;

    @Test
    void testCloset() {
        Long createdClothesId = closetService.createCloset(100L,1L).getClothes().getClothesId();
        logger.info("Created Clothes ID: {}", createdClothesId);
        assertEquals(100L, createdClothesId, "Closet creation failed: Clothes ID does not match expected.");
        closetService.deleteCloset(100L, 1L);
    }
}
