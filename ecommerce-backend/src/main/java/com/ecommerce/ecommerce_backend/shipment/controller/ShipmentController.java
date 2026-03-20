package com.ecommerce.ecommerce_backend.shipment.controller;

import com.ecommerce.ecommerce_backend.common.ApiResponse;
import com.ecommerce.ecommerce_backend.shipment.entity.Shipment;
import com.ecommerce.ecommerce_backend.shipment.repository.ShipmentRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shipments")
public class ShipmentController {

    private final ShipmentRepository shipmentRepository;

    public ShipmentController(ShipmentRepository shipmentRepository) {
        this.shipmentRepository = shipmentRepository;
    }

    @GetMapping
    public ApiResponse<List<Shipment>> getAllShipments() {
        return new ApiResponse<>(true, "Shipments fetched", shipmentRepository.findAll());
    }

    @PostMapping
    public ApiResponse<Shipment> createShipment(@RequestBody Shipment shipment) {
        return new ApiResponse<>(true, "Shipment created", shipmentRepository.save(shipment));
    }

    @PutMapping("/{id}/status")
    public ApiResponse<Shipment> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        Shipment shipment = shipmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shipment not found"));
        shipment.setShipmentStatus(status.toUpperCase());
        return new ApiResponse<>(true, "Shipment updated", shipmentRepository.save(shipment));
    }

    @PutMapping("/{id}/tracking")
    public ApiResponse<Shipment> updateTracking(
            @PathVariable Long id,
            @RequestParam String trackingNumber) {
        Shipment shipment = shipmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shipment not found"));
        shipment.setTrackingNumber(trackingNumber);
        return new ApiResponse<>(true, "Tracking updated", shipmentRepository.save(shipment));
    }
}