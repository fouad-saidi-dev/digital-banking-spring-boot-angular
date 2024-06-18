package com.fouadev.backend.security.responses;

import lombok.Data;

@Data
public class AppUserResponse {
    private String username;
    private String email;
}