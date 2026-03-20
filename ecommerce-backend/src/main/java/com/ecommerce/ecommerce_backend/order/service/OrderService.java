package com.ecommerce.ecommerce_backend.order.service;

import com.ecommerce.ecommerce_backend.order.entity.Order;
import java.util.List;

public interface OrderService {
    Order placeOrder(Long userId, Long productId, Integer quantity);
    List<Order> getAllOrders();
    List<Order> getOrdersByUser(Long userId);
    Order updateOrderStatus(Long orderId, String status);
}