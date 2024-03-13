package com.cocodi.infrastructure.health;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public")
public class HealthController {
    @GetMapping("/health")
    ResponseEntity<String> health() {
        return ResponseEntity.ok().build();
    }
}
