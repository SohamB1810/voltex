package com.ecommerce.ecommerce_backend.payment.service;

public interface PaymentService {

    String processPayment(Long orderId, String method);

}