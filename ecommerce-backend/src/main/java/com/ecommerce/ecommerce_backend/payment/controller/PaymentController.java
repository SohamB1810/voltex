package com.ecommerce.ecommerce_backend.payment.controller;

import com.ecommerce.ecommerce_backend.common.ApiResponse;
import com.ecommerce.ecommerce_backend.payment.entity.Payment;
import com.ecommerce.ecommerce_backend.payment.enums.PaymentStatus;
import com.ecommerce.ecommerce_backend.payment.repository.PaymentRepository;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentRepository paymentRepository;

    public PaymentController(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    @GetMapping
    public ApiResponse<List<Payment>> getAllPayments() {
        return new ApiResponse<>(true, "Payments fetched", paymentRepository.findAll());
    }

    @PostMapping
    public ApiResponse<Payment> createPayment(@RequestBody Payment payment) {
        return new ApiResponse<>(true, "Payment created", paymentRepository.save(payment));
    }

    @PutMapping("/{id}/status")
    public ApiResponse<Payment> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        payment.setPaymentStatus(PaymentStatus.valueOf(status.toUpperCase()));
        return new ApiResponse<>(true, "Payment updated", paymentRepository.save(payment));
    }
}