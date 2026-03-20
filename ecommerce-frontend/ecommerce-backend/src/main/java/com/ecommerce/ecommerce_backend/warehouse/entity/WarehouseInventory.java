package com.ecommerce.ecommerce_backend.warehouse.entity;

import com.ecommerce.ecommerce_backend.product.entity.Product;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "warehouse_inventory")
public class WarehouseInventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "warehouse_id", nullable = false)
    private Warehouse warehouse;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    private Integer quantity;
}
