package com.ecommerce.ecommerce_backend.warehouse.service;

import com.ecommerce.ecommerce_backend.warehouse.entity.Warehouse;
import java.util.List;

public interface WarehouseService {

    Warehouse createWarehouse(Warehouse warehouse);

    List<Warehouse> getAllWarehouses();

    Warehouse getWarehouseById(Long id);

}