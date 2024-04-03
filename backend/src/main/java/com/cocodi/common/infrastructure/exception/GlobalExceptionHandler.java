package com.cocodi.common.infrastructure.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.ControllerAdvice;

@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {

//    @ExceptionHandler(Exception.class)
//    public ResponseEntity<String> handleException(Exception e) {
//        log.info(e.getMessage());
//        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Internal Server Error");
//    }
}