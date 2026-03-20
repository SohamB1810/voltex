package com.ecommerce.ecommerce_backend.inventory.controller;

import com.ecommerce.ecommerce_backend.common.ApiResponse;
import com.ecommerce.ecommerce_backend.inventory.entity.Inventory;
import com.ecommerce.ecommerce_backend.inventory.repository.InventoryRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    private final InventoryRepository inventoryRepository;

    public InventoryController(InventoryRepository inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }

    @GetMapping
    public ApiResponse<List<Inventory>> getAllInventory() {
        return new ApiResponse<>(true, "Inventory fetched", inventoryRepository.findAll());
    }

    @PutMapping("/{id}")
    public ApiResponse<Inventory> updateInventory(@PathVariable Long id, @RequestParam Integer quantity) {
        Inventory inventory = inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventory not found"));
        inventory.setStockQuantity(quantity);
        return new ApiResponse<>(true, "Inventory updated", inventoryRepository.save(inventory));
    }
}