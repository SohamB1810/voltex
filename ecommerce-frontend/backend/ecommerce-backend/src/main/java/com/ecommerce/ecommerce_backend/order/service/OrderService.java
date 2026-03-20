package com.ecommerce.ecommerce_backend.order.service;

import com.ecommerce.ecommerce_backend.order.entity.Order;

public interface OrderService {

    Order placeOrder(Long userId, Long productId, Integer quantity);

}