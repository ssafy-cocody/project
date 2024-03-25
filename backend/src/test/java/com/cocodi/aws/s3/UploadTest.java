package com.cocodi.aws.s3;

import com.cocodi.aws.application.service.S3Service;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class UploadTest {
    @Autowired
    private S3Service s3Service;

    @Test
    void  upload() {

    }
}
