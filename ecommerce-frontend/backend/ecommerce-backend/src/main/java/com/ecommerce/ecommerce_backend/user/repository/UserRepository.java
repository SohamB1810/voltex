package com.ecommerce.ecommerce_backend.user.repository;

import com.ecommerce.ecommerce_backend.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);

}