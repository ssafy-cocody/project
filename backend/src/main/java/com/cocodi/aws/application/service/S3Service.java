package com.cocodi.aws.application.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class S3Service {

    private final AmazonS3 amazonS3;

    @Value("${spring.cloud.aws.s3.bucket}")
    private String bucketName;

    private String generateFileName(MultipartFile file) {
        return UUID.randomUUID() + "_" + file.getOriginalFilename();
    }

    private String upload(String dir, MultipartFile file) {
        String fileName = dir + "/" + generateFileName(file);

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(file.getSize());
        metadata.setContentType(file.getContentType());

        try {
            PutObjectRequest request = new PutObjectRequest(bucketName, fileName, file.getInputStream(), metadata);
            request.withCannedAcl(CannedAccessControlList.PublicRead);
            amazonS3.putObject(request);
        } catch (Exception e) {
            throw new RuntimeException();
        }
        return amazonS3.getUrl(bucketName, fileName).toString();
    }

    public String uploadDefault(MultipartFile file) {
        return upload("cocodi", file);
    }

    public String uploadAI(MultipartFile file) {
        return upload("cocodi-ai", file);
    }
}
