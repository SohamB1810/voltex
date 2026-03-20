package com.ecommerce.ecommerce_backend.inventory.entity;

import com.ecommerce.ecommerce_backend.product.entity.Product;
import jakarta.persistence.*;

@Entity
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    private Product product;

    private Integer stockQuantity;
}