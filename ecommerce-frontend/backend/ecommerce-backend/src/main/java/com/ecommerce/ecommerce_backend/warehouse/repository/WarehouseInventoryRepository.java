package com.ecommerce.ecommerce_backend.warehouse.repository;

import com.ecommerce.ecommerce_backend.warehouse.entity.WarehouseInventory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WarehouseInventoryRepository
        extends JpaRepository<WarehouseInventory, Long> {

    List<WarehouseInventory> findByProductId(Long productId);

}