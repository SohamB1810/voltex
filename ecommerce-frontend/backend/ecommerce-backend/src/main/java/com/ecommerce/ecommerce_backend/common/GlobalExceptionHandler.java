package com.ecommerce.ecommerce_backend.common;

import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ApiResponse<String> handleRuntimeException(RuntimeException ex) {

        return new ApiResponse<>(
                false,
                ex.getMessage(),
                null
        );
    }

    @ExceptionHandler(Exception.class)
    public ApiResponse<String> handleException(Exception ex) {

        return new ApiResponse<>(
                false,
                "Internal Server Error",
                null
        );
    }

}