package com.ecommerce.ecommerce_backend.events.consumer;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class OrderEventConsumer {

    private static final Logger log = LoggerFactory.getLogger(OrderEventConsumer.class);
    private final ObjectMapper objectMapper = new ObjectMapper();

    @KafkaListener(topics = "order-created-topic", groupId = "order-group")
    public void consumeOrderCreatedEvent(String message) {
        try {
            log.info("Received order event: {}", message);

            Map<String, Object> eventData = objectMapper.readValue(message, Map.class);

            Long orderId = Long.valueOf(eventData.get("orderId").toString());
            String status = eventData.get("status").toString();

            log.info("Processing order ID: {}, status: {}", orderId, status);

            handleOrderEvent(orderId, status);

        } catch (Exception e) {
            log.error("Failed to process order event. Raw message: {}", message, e);
        }
    }

    private void handleOrderEvent(Long orderId, String status) {
        switch (status.toUpperCase()) {
            case "CREATED" -> log.info("Order {} created — trigger inventory check", orderId);
            case "PAID"    -> log.info("Order {} paid — trigger shipment", orderId);
            case "SHIPPED" -> log.info("Order {} shipped — notify customer", orderId);
            case "CANCELLED" -> log.info("Order {} cancelled — restore inventory", orderId);
            default -> log.warn("Order {} has unknown status: {}", orderId, status);
        }
    }
}