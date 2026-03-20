package com.ecommerce.ecommerce_backend.inventory.entity;

import com.ecommerce.ecommerce_backend.product.entity.Product;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "inventory")
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "product_id", nullable = false, unique = true)
    private Product product;

    private Integer stockQuantity;
}
