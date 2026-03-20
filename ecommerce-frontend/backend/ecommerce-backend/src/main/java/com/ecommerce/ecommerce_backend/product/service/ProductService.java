package com.ecommerce.ecommerce_backend.product.service;

import com.ecommerce.ecommerce_backend.product.entity.Product;

import java.util.List;

public interface ProductService {

    Product createProduct(Product product);

    List<Product> getAllProducts();

    Product getProductById(Long id);

    void deleteProduct(Long id);
}