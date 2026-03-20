package com.ecommerce.ecommerce_backend.inventory.service;

public interface InventoryService {

    Integer checkStock(Long productId);

    void reduceStock(Long productId, Integer quantity);

    void increaseStock(Long productId, Integer quantity);

}