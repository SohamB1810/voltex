package com.ecommerce.ecommerce_backend.order.controller;

import com.ecommerce.ecommerce_backend.common.ApiResponse;
import com.ecommerce.ecommerce_backend.order.entity.Order;
import com.ecommerce.ecommerce_backend.order.service.OrderService;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/place")
    public ApiResponse<Order> placeOrder(
            @RequestParam Long userId,
            @RequestParam Long productId,
            @RequestParam Integer quantity
    ) {

        Order order = orderService.placeOrder(
                userId,
                productId,
                quantity
        );

        return new ApiResponse<>(
                true,
                "Order placed successfully",
                order
        );
    }

}