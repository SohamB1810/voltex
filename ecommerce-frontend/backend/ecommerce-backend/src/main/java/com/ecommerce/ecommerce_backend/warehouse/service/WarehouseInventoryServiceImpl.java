package com.ecommerce.ecommerce_backend.warehouse.service;

import com.ecommerce.ecommerce_backend.warehouse.entity.WarehouseInventory;
import com.ecommerce.ecommerce_backend.warehouse.repository.WarehouseInventoryRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WarehouseInventoryServiceImpl implements WarehouseInventoryService {

    private final WarehouseInventoryRepository warehouseInventoryRepository;

    public WarehouseInventoryServiceImpl(WarehouseInventoryRepository warehouseInventoryRepository) {
        this.warehouseInventoryRepository = warehouseInventoryRepository;
    }

    @Override
    public Long allocateWarehouse(Long productId, Integer quantity) {

        List<WarehouseInventory> inventories =
                warehouseInventoryRepository.findByProductId(productId);

        for (WarehouseInventory inventory : inventories) {

            if (inventory.getQuantity() >= quantity) {

                inventory.setQuantity(inventory.getQuantity() - quantity);

                warehouseInventoryRepository.save(inventory);

                return inventory.getWarehouse().getId();
            }
        }

        throw new RuntimeException("No warehouse has sufficient stock");

    }
}