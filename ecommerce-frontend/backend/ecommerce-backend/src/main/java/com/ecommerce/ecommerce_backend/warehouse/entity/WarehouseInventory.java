package com.ecommerce.ecommerce_backend.warehouse.entity;

import com.ecommerce.ecommerce_backend.product.entity.Product;
import jakarta.persistence.*;

@Entity
public class WarehouseInventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Warehouse warehouse;

    @ManyToOne
    private Product product;

    private Integer quantity;

}