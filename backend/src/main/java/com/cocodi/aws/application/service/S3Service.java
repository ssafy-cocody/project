package com.cocodi.aws.application.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class S3Service {

    private final AmazonS3 amazonS3;

    @Value("${spring.cloud.aws.s3.bucket}")
    private String bucketName;

    private String generateFileName(String fileName) {
        return UUID.randomUUID() + "_" + fileName;
    }

    private String upload(String dir, ObjectMetadata metadata, String fileName, InputStream inputStream) {
        String fileDir = dir + "/" + generateFileName(fileName);
        PutObjectRequest request = new PutObjectRequest(bucketName, fileDir, inputStream, metadata);

        request.withCannedAcl(CannedAccessControlList.PublicRead);
        amazonS3.putObject(request);
        return amazonS3.getUrl(bucketName, fileDir).toString();
    }

    private String uploadMultipartFile(String dir, MultipartFile file) {
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(file.getSize());
        metadata.setContentType(file.getContentType());
        try {
            return upload(dir, metadata, file.getOriginalFilename(), file.getInputStream());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private String uploadBytePngFile(String dir, byte[] file, String fileName) {
        InputStream inputStream = new ByteArrayInputStream(file);

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentType("image/png");
        metadata.setContentLength(file.length);

        return upload(dir, metadata, fileName, inputStream);
    }

    public String uploadDefault(MultipartFile file) {
        return uploadMultipartFile("cocodi", file);
    }

    public String uploadAI(MultipartFile file) {
        return uploadMultipartFile("cocodi-ai", file);
    }

    public String uploadAI(String uuid, byte[] file) {
        return uploadBytePngFile("cocodi-ai", file, uuid);
    }

}
