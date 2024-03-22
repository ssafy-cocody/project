package com.cocodi.aws.presentation.controller;

import com.cocodi.aws.application.service.S3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/public/v1/s3")
@RequiredArgsConstructor
public class S3Controller {
    private final S3Service s3Service;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadTest(@RequestParam MultipartFile multipartFile) {
        String fileUrl = s3Service.uploadAI(multipartFile);
        return ResponseEntity.ok("File uploaded successfully. URL: " + fileUrl);
    }
}
