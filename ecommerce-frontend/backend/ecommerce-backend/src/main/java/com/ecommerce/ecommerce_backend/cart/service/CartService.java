package com.ecommerce.ecommerce_backend.cart.service;

import com.ecommerce.ecommerce_backend.cart.entity.Cart;

public interface CartService {

    Cart getCartByUserId(Long userId);

    String addProductToCart(Long userId, Long productId, Integer quantity);

    String removeProductFromCart(Long cartItemId);

}