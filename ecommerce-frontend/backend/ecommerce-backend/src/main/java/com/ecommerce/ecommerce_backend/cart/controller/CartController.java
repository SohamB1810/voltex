package com.ecommerce.ecommerce_backend.cart.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @PostMapping("/add")
    public String addToCart() {
        return "Product added to cart";
    }

    @GetMapping
    public String getCart() {
        return "User cart";
    }
}