package com.ecommerce.ecommerce_backend.payment.entity;

import com.ecommerce.ecommerce_backend.order.entity.Order;
import com.ecommerce.ecommerce_backend.payment.enums.PaymentStatus;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JsonIgnoreProperties({"user", "product", "hibernateLazyInitializer"})
    private Order order;

    private String paymentMethod;

    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;

    private Double amount;

    public Payment() {}

    public Long getId() { return id; }
    public Order getOrder() { return order; }
    public String getPaymentMethod() { return paymentMethod; }
    public PaymentStatus getPaymentStatus() { return paymentStatus; }
    public Double getAmount() { return amount; }

    public void setId(Long id) { this.id = id; }
    public void setOrder(Order order) { this.order = order; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public void setPaymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }
    public void setAmount(Double amount) { this.amount = amount; }
}