package com.ecommerce.ecommerce_backend.shipment.entity;

import com.ecommerce.ecommerce_backend.order.entity.Order;

import jakarta.persistence.*;

@Entity
@Table(name = "shipments")
public class Shipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    private Order order;

    private Long warehouseId;

    private String shipmentStatus;

    private String trackingNumber;

    public Shipment() {}

    public Long getId() {
        return id;
    }

    public Order getOrder() {
        return order;
    }

    public Long getWarehouseId() {
        return warehouseId;
    }

    public String getShipmentStatus() {
        return shipmentStatus;
    }

    public String getTrackingNumber() {
        return trackingNumber;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public void setWarehouseId(Long warehouseId) {
        this.warehouseId = warehouseId;
    }

    public void setShipmentStatus(String shipmentStatus) {
        this.shipmentStatus = shipmentStatus;
    }

    public void setTrackingNumber(String trackingNumber) {
        this.trackingNumber = trackingNumber;
    }
}