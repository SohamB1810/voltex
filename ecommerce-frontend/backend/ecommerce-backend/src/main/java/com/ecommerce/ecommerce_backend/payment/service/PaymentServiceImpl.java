package com.ecommerce.ecommerce_backend.payment.service;

import com.ecommerce.ecommerce_backend.order.entity.Order;
import com.ecommerce.ecommerce_backend.order.repository.OrderRepository;
import com.ecommerce.ecommerce_backend.payment.entity.Payment;
import com.ecommerce.ecommerce_backend.payment.repository.PaymentRepository;

import org.springframework.stereotype.Service;

@Service
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;

    public PaymentServiceImpl(PaymentRepository paymentRepository,
                              OrderRepository orderRepository) {
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
    }

    @Override
    public String processPayment(Long orderId, String method) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setPaymentMethod(method);
        payment.setPaymentStatus("SUCCESS");
        payment.setAmount(order.getTotalPrice());

        paymentRepository.save(payment);

        return "Payment completed";
    }
}