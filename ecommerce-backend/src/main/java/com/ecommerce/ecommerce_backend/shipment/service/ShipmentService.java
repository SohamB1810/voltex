package com.ecommerce.ecommerce_backend.shipment.service;

public interface ShipmentService {

    void createShipment(Long orderId, Long warehouseId);

}