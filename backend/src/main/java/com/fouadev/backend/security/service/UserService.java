package com.fouadev.backend.security.service;

import com.fouadev.backend.dtos.AppRoleDTO;
import com.fouadev.backend.dtos.AppUserDTO;

import java.util.List;

public interface UserService {
    AppUserDTO loadUserByUsername(String username);
    AppUserDTO updatePassword(String username,AppUserDTO userDTO);
    AppUserDTO addNewUser(AppUserDTO userDTO);
    AppRoleDTO addNewRole(String role,AppRoleDTO appRoleDTO);
    void addRoleToUser(String username,String role);
    void removeRoleFromUser(String username,String role);
    List<AppUserDTO> getUsers();
    List<AppRoleDTO> getRolesUser(String username);
}