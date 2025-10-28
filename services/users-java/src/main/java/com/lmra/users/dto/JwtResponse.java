package com.lmra.users.dto;

public record JwtResponse(
    String token,
    String type,
    Long userId,
    String email,
    String role
) {}

