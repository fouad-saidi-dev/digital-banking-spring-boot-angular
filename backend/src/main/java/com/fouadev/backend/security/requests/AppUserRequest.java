package com.fouadev.backend.security.requests;

import lombok.Data;

@Data
public class AppUserRequest {
    private String username;
    private String email;
    private String password;
}