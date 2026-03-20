package com.ecommerce.ecommerce_backend.order.service;

import com.ecommerce.ecommerce_backend.order.entity.Order;
import com.ecommerce.ecommerce_backend.order.enums.OrderStatus;
import com.ecommerce.ecommerce_backend.order.repository.OrderRepository;
import com.ecommerce.ecommerce_backend.product.entity.Product;
import com.ecommerce.ecommerce_backend.product.repository.ProductRepository;
import com.ecommerce.ecommerce_backend.user.entity.User;
import com.ecommerce.ecommerce_backend.user.repository.UserRepository;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final KafkaTemplate<String, String> kafkaTemplate;

    public OrderServiceImpl(OrderRepository orderRepository,
                            UserRepository userRepository,
                            ProductRepository productRepository,
                            KafkaTemplate<String, String> kafkaTemplate) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.kafkaTemplate = kafkaTemplate;
    }

    @Override
    public Order placeOrder(Long userId, Long productId, Integer quantity) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (product.getStock() < quantity) {
            throw new RuntimeException("Insufficient stock");
        }

        product.setStock(product.getStock() - quantity);
        productRepository.save(product);

        Order order = new Order();
        order.setUser(user);
        order.setProduct(product);
        order.setQuantity(quantity);
        order.setTotalPrice(product.getPrice() * quantity);
        order.setOrderStatus(OrderStatus.CREATED);

        Order saved = orderRepository.save(order);

        String message = "{\"orderId\":" + saved.getId() + ",\"status\":\"CREATED\",\"userId\":" + userId + ",\"productId\":" + productId + "}";
        kafkaTemplate.send("order-created-topic", message);

        return saved;
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public List<Order> getOrdersByUser(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    @Override
    public Order updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setOrderStatus(OrderStatus.valueOf(status));
        return orderRepository.save(order);
    }
}