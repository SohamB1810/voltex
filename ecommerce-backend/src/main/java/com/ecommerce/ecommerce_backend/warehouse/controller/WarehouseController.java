package com.ecommerce.ecommerce_backend.warehouse.controller;

import com.ecommerce.ecommerce_backend.common.ApiResponse;
import com.ecommerce.ecommerce_backend.warehouse.entity.Warehouse;
import com.ecommerce.ecommerce_backend.warehouse.repository.WarehouseRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/warehouse")
public class WarehouseController {

    private final WarehouseRepository warehouseRepository;

    public WarehouseController(WarehouseRepository warehouseRepository) {
        this.warehouseRepository = warehouseRepository;
    }

    @GetMapping
    public ApiResponse<List<Warehouse>> getAllWarehouses() {
        return new ApiResponse<>(true, "Warehouses fetched", warehouseRepository.findAll());
    }

    @PostMapping
    public ApiResponse<Warehouse> createWarehouse(@RequestBody Warehouse warehouse) {
        return new ApiResponse<>(true, "Warehouse created", warehouseRepository.save(warehouse));
    }
}