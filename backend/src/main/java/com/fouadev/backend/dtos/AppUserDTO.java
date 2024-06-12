package com.fouadev.backend.dtos;

import com.fouadev.backend.entities.AppRole;
import lombok.Data;

import java.util.List;

@Data
public class AppUserDTO {
    private String username;
    private String password;
    private List<AppRole> roles;
}