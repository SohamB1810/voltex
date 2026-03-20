package com.ecommerce.ecommerce_backend.product.controller;

import com.ecommerce.ecommerce_backend.common.ApiResponse;
import com.ecommerce.ecommerce_backend.product.entity.Product;
import com.ecommerce.ecommerce_backend.product.service.ProductService;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/{id}")
    public ApiResponse<Product> getProduct(@PathVariable Long id) {
        return new ApiResponse<>(true, "Product fetched", productService.getProductById(id));
    }

    @GetMapping
    public Page<Product> getProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return productService.getAllProducts(PageRequest.of(page, size));
    }

    @PostMapping
    public ApiResponse<Product> createProduct(@RequestBody Product product) {
        return new ApiResponse<>(true, "Product created", productService.createProduct(product));
    }

    @PutMapping("/{id}")
    public ApiResponse<Product> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        return new ApiResponse<>(true, "Product updated", productService.updateProduct(id, product));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return new ApiResponse<>(true, "Product deleted", null);
    }
}