package com.ecommerce.ecommerce_backend.shipment.repository;

import com.ecommerce.ecommerce_backend.shipment.entity.Shipment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShipmentRepository
        extends JpaRepository<Shipment, Long> {
}