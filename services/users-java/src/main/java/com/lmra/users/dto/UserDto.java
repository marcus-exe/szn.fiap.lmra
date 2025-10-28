package com.lmra.users.dto;

import com.lmra.users.model.User.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public record UserDto(
    Long id,
    @Email
    @NotBlank
    String email,
    String firstName,
    String lastName,
    Role role,
    Boolean active,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}

