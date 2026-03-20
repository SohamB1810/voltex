package com.ecommerce.ecommerce_backend.auth.service;

import com.ecommerce.ecommerce_backend.auth.dto.LoginRequest;
import com.ecommerce.ecommerce_backend.auth.dto.LoginResponse;
import com.ecommerce.ecommerce_backend.auth.dto.RegisterRequest;

public interface AuthService {

    void register(RegisterRequest request);

    LoginResponse login(LoginRequest request);

}