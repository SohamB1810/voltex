package com.ecommerce.ecommerce_backend.cart.entity;

import com.ecommerce.ecommerce_backend.user.entity.User;
import jakarta.persistence.*;

@Entity
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    private User user;
}