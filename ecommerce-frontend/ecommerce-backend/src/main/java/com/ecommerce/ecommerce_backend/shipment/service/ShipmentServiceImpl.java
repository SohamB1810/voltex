package com.ecommerce.ecommerce_backend.shipment.service;

import com.ecommerce.ecommerce_backend.order.entity.Order;
import com.ecommerce.ecommerce_backend.order.repository.OrderRepository;
import com.ecommerce.ecommerce_backend.shipment.entity.Shipment;
import com.ecommerce.ecommerce_backend.shipment.repository.ShipmentRepository;

import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class ShipmentServiceImpl implements ShipmentService {

    private final ShipmentRepository shipmentRepository;
    private final OrderRepository orderRepository;

    public ShipmentServiceImpl(
            ShipmentRepository shipmentRepository,
            OrderRepository orderRepository
    ) {
        this.shipmentRepository = shipmentRepository;
        this.orderRepository = orderRepository;
    }

    @Override
    public void createShipment(Long orderId, Long warehouseId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        Shipment shipment = new Shipment();

        shipment.setOrder(order);
        shipment.setWarehouseId(warehouseId);
        shipment.setShipmentStatus("PROCESSING");

        shipment.setTrackingNumber(
                UUID.randomUUID().toString()
        );

        shipmentRepository.save(shipment);

    }
}