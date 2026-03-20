package com.ecommerce.ecommerce_backend.inventory.repository;

import com.ecommerce.ecommerce_backend.inventory.entity.Inventory;
import com.ecommerce.ecommerce_backend.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    Inventory findByProduct(Product product);

}