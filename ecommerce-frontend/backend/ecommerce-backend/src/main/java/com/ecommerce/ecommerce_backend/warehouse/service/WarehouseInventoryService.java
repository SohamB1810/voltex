package com.ecommerce.ecommerce_backend.warehouse.service;

public interface WarehouseInventoryService {

    Long allocateWarehouse(Long productId, Integer quantity);

}