package com.ecommerce.ecommerce_backend.cart.entity;

import com.ecommerce.ecommerce_backend.product.entity.Product;
import jakarta.persistence.*;

@Entity
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Cart cart;

    @ManyToOne
    private Product product;

    private Integer quantity;
}