package com.ecommerce.ecommerce_backend.user.service;

import com.ecommerce.ecommerce_backend.user.entity.User;

import java.util.List;

public interface UserService {

    User createUser(User user);

    List<User> getAllUsers();

    User getUserById(Long id);

    void deleteUser(Long id);
}