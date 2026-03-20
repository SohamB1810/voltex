package com.ecommerce.ecommerce_backend.warehouse.service;

import com.ecommerce.ecommerce_backend.warehouse.entity.Warehouse;
import com.ecommerce.ecommerce_backend.warehouse.repository.WarehouseRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WarehouseServiceImpl implements WarehouseService {

    private final WarehouseRepository warehouseRepository;

    public WarehouseServiceImpl(WarehouseRepository warehouseRepository) {
        this.warehouseRepository = warehouseRepository;
    }

    @Override
    public Warehouse createWarehouse(Warehouse warehouse) {

        return warehouseRepository.save(warehouse);

    }

    @Override
    public List<Warehouse> getAllWarehouses() {

        return warehouseRepository.findAll();

    }

    @Override
    public Warehouse getWarehouseById(Long id) {

        return warehouseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Warehouse not found"));

    }
}