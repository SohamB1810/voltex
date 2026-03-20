package com.ecommerce.ecommerce_backend.cart.controller;

import com.ecommerce.ecommerce_backend.cart.entity.Cart;
import com.ecommerce.ecommerce_backend.cart.service.CartService;
import com.ecommerce.ecommerce_backend.common.ApiResponse;
import com.ecommerce.ecommerce_backend.user.entity.User;
import com.ecommerce.ecommerce_backend.user.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;
    private final UserRepository userRepository;

    public CartController(CartService cartService, UserRepository userRepository) {
        this.cartService = cartService;
        this.userRepository = userRepository;
    }

    // GET /api/cart  →  fetch the logged-in user's cart
    @GetMapping
    public ResponseEntity<ApiResponse<Cart>> getCart(
            @AuthenticationPrincipal UserDetails userDetails) {

        User user = userRepository.findByEmail(userDetails.getUsername());
        Cart cart = cartService.getCartByUserId(user.getId());

        return ResponseEntity.ok(new ApiResponse<>(true, "Cart fetched successfully", cart));
    }

    // POST /api/cart/add?productId=1&quantity=2
    @PostMapping("/add")
    public ResponseEntity<ApiResponse<String>> addToCart(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam Long productId,
            @RequestParam Integer quantity) {

        User user = userRepository.findByEmail(userDetails.getUsername());
        String result = cartService.addProductToCart(user.getId(), productId, quantity);

        return ResponseEntity.ok(new ApiResponse<>(true, result, null));
    }

    // DELETE /api/cart/remove/{cartItemId}
    @DeleteMapping("/remove/{cartItemId}")
    public ResponseEntity<ApiResponse<String>> removeFromCart(
            @PathVariable Long cartItemId) {

        String result = cartService.removeProductFromCart(cartItemId);
        return ResponseEntity.ok(new ApiResponse<>(true, result, null));
    }
}