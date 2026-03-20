package com.ecommerce.ecommerce_backend.inventory.service;

import com.ecommerce.ecommerce_backend.inventory.entity.Inventory;
import com.ecommerce.ecommerce_backend.inventory.repository.InventoryRepository;
import com.ecommerce.ecommerce_backend.product.entity.Product;
import com.ecommerce.ecommerce_backend.product.repository.ProductRepository;

import org.springframework.stereotype.Service;

@Service
public class InventoryServiceImpl implements InventoryService {

    private final InventoryRepository inventoryRepository;
    private final ProductRepository productRepository;

    public InventoryServiceImpl(InventoryRepository inventoryRepository,
                                ProductRepository productRepository) {

        this.inventoryRepository = inventoryRepository;
        this.productRepository = productRepository;
    }

    @Override
    public Integer checkStock(Long productId) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Inventory inventory = inventoryRepository.findByProduct(product);

        return inventory.getStockQuantity();
    }

    @Override
    public void reduceStock(Long productId, Integer quantity) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Inventory inventory = inventoryRepository.findByProduct(product);

        if (inventory.getStockQuantity() < quantity) {
            throw new RuntimeException("Insufficient stock");
        }

        inventory.setStockQuantity(inventory.getStockQuantity() - quantity);

        inventoryRepository.save(inventory);
    }

    @Override
    public void increaseStock(Long productId, Integer quantity) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Inventory inventory = inventoryRepository.findByProduct(product);

        inventory.setStockQuantity(inventory.getStockQuantity() + quantity);

        inventoryRepository.save(inventory);
    }
}