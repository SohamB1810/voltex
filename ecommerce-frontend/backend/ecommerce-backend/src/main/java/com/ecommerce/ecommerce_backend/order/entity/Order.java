package com.ecommerce.ecommerce_backend.order.entity;

import com.ecommerce.ecommerce_backend.order.enums.OrderStatus;
import com.ecommerce.ecommerce_backend.product.entity.Product;
import com.ecommerce.ecommerce_backend.user.entity.User;

import jakarta.persistence.*;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    @ManyToOne
    private Product product;

    private Integer quantity;

    private Double totalPrice;

    @Enumerated(EnumType.STRING)
    private OrderStatus orderStatus;

    public Order() {}

    // getters

    public Long getId() { return id; }

    public User getUser() { return user; }

    public Product getProduct() { return product; }

    public Integer getQuantity() { return quantity; }

    public Double getTotalPrice() { return totalPrice; }

    public OrderStatus getOrderStatus() { return orderStatus; }

    // setters

    public void setId(Long id) { this.id = id; }

    public void setUser(User user) { this.user = user; }

    public void setProduct(Product product) { this.product = product; }

    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public void setTotalPrice(Double totalPrice) { this.totalPrice = totalPrice; }

    public void setOrderStatus(OrderStatus orderStatus) { this.orderStatus = orderStatus; }

}