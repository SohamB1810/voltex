package com.ecommerce.ecommerce_backend.user.controller;

import com.ecommerce.ecommerce_backend.user.dto.UserDTO;
import com.ecommerce.ecommerce_backend.user.entity.User;
import com.ecommerce.ecommerce_backend.user.service.UserService;
import org.modelmapper.ModelMapper;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final ModelMapper modelMapper;

    public UserController(UserService userService,
                          ModelMapper modelMapper) {
        this.userService = userService;
        this.modelMapper = modelMapper;
    }

    @PostMapping
    public UserDTO createUser(@RequestBody UserDTO userDTO) {

        User user = modelMapper.map(userDTO, User.class);

        User savedUser = userService.createUser(user);

        return modelMapper.map(savedUser, UserDTO.class);
    }

    @GetMapping
    public List<UserDTO> getAllUsers() {

        return userService.getAllUsers()
                .stream()
                .map(user -> modelMapper.map(user, UserDTO.class))
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public UserDTO getUserById(@PathVariable Long id) {

        User user = userService.getUserById(id);

        return modelMapper.map(user, UserDTO.class);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }
}