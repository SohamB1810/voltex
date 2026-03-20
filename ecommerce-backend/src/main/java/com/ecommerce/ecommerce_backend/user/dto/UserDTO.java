package com.ecommerce.ecommerce_backend.user.dto;

public class UserDTO {

    private Long id;
    private String name;
    private String email;
    private String password;
    private String role;
    private Long warehouseId;

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getPassword() { return password; }
    public String getRole() { return role; }
    public Long getWarehouseId() { return warehouseId; }

    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setEmail(String email) { this.email = email; }
    public void setPassword(String password) { this.password = password; }
    public void setRole(String role) { this.role = role; }
    public void setWarehouseId(Long warehouseId) { this.warehouseId = warehouseId; }
}