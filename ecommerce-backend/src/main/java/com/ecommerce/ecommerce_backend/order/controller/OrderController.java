package com.ecommerce.ecommerce_backend.order.controller;

import com.ecommerce.ecommerce_backend.common.ApiResponse;
import com.ecommerce.ecommerce_backend.order.entity.Order;
import com.ecommerce.ecommerce_backend.order.service.OrderService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public ApiResponse<List<Order>> getAllOrders() {
        return new ApiResponse<>(true, "Orders fetched", orderService.getAllOrders());
    }

    @GetMapping("/user/{userId}")
    public ApiResponse<List<Order>> getOrdersByUser(@PathVariable Long userId) {
        return new ApiResponse<>(true, "Orders fetched", orderService.getOrdersByUser(userId));
    }

    @PostMapping("/place")
    public ApiResponse<Order> placeOrder(
            @RequestParam Long userId,
            @RequestParam Long productId,
            @RequestParam Integer quantity) {
        return new ApiResponse<>(true, "Order placed successfully", orderService.placeOrder(userId, productId, quantity));
    }

    @PutMapping("/{orderId}/status")
    public ApiResponse<Order> updateStatus(
            @PathVariable Long orderId,
            @RequestParam String status) {
        return new ApiResponse<>(true, "Status updated", orderService.updateOrderStatus(orderId, status));
    }
}