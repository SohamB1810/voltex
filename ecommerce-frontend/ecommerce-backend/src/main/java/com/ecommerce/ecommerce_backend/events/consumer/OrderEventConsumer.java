package com.ecommerce.ecommerce_backend.events.consumer;

import com.ecommerce.ecommerce_backend.events.dto.OrderCreatedEvent;
import com.ecommerce.ecommerce_backend.shipment.service.ShipmentService;
import com.ecommerce.ecommerce_backend.warehouse.service.WarehouseInventoryService;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class OrderEventConsumer {

    private final WarehouseInventoryService warehouseInventoryService;
    private final ShipmentService shipmentService;

    public OrderEventConsumer(
            WarehouseInventoryService warehouseInventoryService,
            ShipmentService shipmentService
    ) {
        this.warehouseInventoryService = warehouseInventoryService;
        this.shipmentService = shipmentService;
    }

    @KafkaListener(topics = "order-created-topic")
    public void handleOrderCreated(OrderCreatedEvent event) {

        // Reduce inventory
        Long warehouseId = warehouseInventoryService.allocateWarehouse(
                event.getProductId(),
                event.getQuantity()
        );

        // Create shipment
        shipmentService.createShipment(
                event.getOrderId(),
                warehouseId
        );

    }
}