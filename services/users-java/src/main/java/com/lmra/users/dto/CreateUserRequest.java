package com.lmra.users.dto;

import com.lmra.users.model.User.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateUserRequest(
    @Email
    @NotBlank
    String email,
    
    @NotBlank
    @Size(min = 8, message = "Password must be at least 8 characters")
    String password,
    
    String firstName,
    
    String lastName,
    
    Role role
) {}

