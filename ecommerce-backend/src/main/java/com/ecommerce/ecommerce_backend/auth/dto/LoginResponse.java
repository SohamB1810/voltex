package com.ecommerce.ecommerce_backend.auth.dto;

public class LoginResponse {

    private String token;
    private String role;
    private Long userId;
    private Long warehouseId;

    public LoginResponse() {}

    public LoginResponse(String token, String role, Long userId, Long warehouseId) {
        this.token = token;
        this.role = role;
        this.userId = userId;
        this.warehouseId = warehouseId;
    }

    public String getToken() { return token; }
    public String getRole() { return role; }
    public Long getUserId() { return userId; }
    public Long getWarehouseId() { return warehouseId; }

    public void setToken(String token) { this.token = token; }
    public void setRole(String role) { this.role = role; }
    public void setUserId(Long userId) { this.userId = userId; }
    public void setWarehouseId(Long warehouseId) { this.warehouseId = warehouseId; }
}