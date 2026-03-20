package com.ecommerce.ecommerce_backend.order.service;

import com.ecommerce.ecommerce_backend.events.dto.OrderCreatedEvent;
import com.ecommerce.ecommerce_backend.events.producer.OrderEventProducer;
import com.ecommerce.ecommerce_backend.order.entity.Order;
import com.ecommerce.ecommerce_backend.order.enums.OrderStatus;
import com.ecommerce.ecommerce_backend.order.repository.OrderRepository;
import com.ecommerce.ecommerce_backend.product.entity.Product;
import com.ecommerce.ecommerce_backend.product.repository.ProductRepository;
import com.ecommerce.ecommerce_backend.user.entity.User;
import com.ecommerce.ecommerce_backend.user.repository.UserRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;

@Service
public class OrderServiceImpl implements OrderService {

    private static final Logger logger =
            LoggerFactory.getLogger(OrderServiceImpl.class);

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OrderEventProducer orderEventProducer;

    public OrderServiceImpl(
            OrderRepository orderRepository,
            ProductRepository productRepository,
            UserRepository userRepository,
            OrderEventProducer orderEventProducer
    ) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.orderEventProducer = orderEventProducer;
    }

    @Override
    public Order placeOrder(Long userId, Long productId, Integer quantity) {

        logger.info("Placing order for user {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Order order = new Order();

        order.setUser(user);
        order.setProduct(product);
        order.setQuantity(quantity);

        double totalPrice = product.getPrice() * quantity;
        order.setTotalPrice(totalPrice);

        order.setOrderStatus(OrderStatus.CREATED);

        Order savedOrder = orderRepository.save(order);

        logger.info("Order saved with id {}", savedOrder.getId());

        // Publish event for inventory + shipment
        OrderCreatedEvent event = new OrderCreatedEvent(
                savedOrder.getId(),
                productId,
                userId,
                quantity
        );

        orderEventProducer.publishOrderCreatedEvent(event);

        logger.info("OrderCreatedEvent published for order {}", savedOrder.getId());

        return savedOrder;
    }

}