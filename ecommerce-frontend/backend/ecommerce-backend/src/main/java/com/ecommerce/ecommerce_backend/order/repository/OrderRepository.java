package com.ecommerce.ecommerce_backend.order.repository;

import com.ecommerce.ecommerce_backend.order.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
}