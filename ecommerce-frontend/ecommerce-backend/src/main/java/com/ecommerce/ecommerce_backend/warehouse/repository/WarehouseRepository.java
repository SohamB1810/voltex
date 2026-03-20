package com.ecommerce.ecommerce_backend.warehouse.repository;

import com.ecommerce.ecommerce_backend.warehouse.entity.Warehouse;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WarehouseRepository extends JpaRepository<Warehouse, Long> {
}