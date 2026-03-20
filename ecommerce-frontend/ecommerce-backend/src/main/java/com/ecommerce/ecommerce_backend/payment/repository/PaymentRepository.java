package com.ecommerce.ecommerce_backend.payment.repository;

import com.ecommerce.ecommerce_backend.payment.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
}