package com.ecommerce.ecommerce_backend.product.service;

import com.ecommerce.ecommerce_backend.product.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProductService {

    Product createProduct(Product product);

    Page<Product> getAllProducts(Pageable pageable);

    Product getProductById(Long id);

    void deleteProduct(Long id);
}
