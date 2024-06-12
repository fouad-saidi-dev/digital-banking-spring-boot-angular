package com.fouadev.backend.security.service;

import com.fouadev.backend.dtos.AppUserDTO;

public interface UserService {
    AppUserDTO loadUserByUsername(String username);
}