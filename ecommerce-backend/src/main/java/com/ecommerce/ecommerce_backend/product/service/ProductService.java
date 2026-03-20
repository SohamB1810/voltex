package com.ecommerce.ecommerce_backend.product.service;

import com.ecommerce.ecommerce_backend.product.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProductService {
    Product getProductById(Long id);
    Page<Product> getAllProducts(Pageable pageable);
    Product createProduct(Product product);
    Product updateProduct(Long id, Product product);
    void deleteProduct(Long id);
}