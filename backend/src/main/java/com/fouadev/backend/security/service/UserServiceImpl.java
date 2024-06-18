package com.fouadev.backend.security.service;
/*
 Created by : Fouad SAIDI on 12/06/2024
 @author : Fouad SAIDI
 @date : 12/06/2024
 @project : e-banking
*/

import com.fouadev.backend.dtos.AppRoleDTO;
import com.fouadev.backend.dtos.AppUserDTO;
import com.fouadev.backend.entities.AppRole;
import com.fouadev.backend.entities.AppUser;
import com.fouadev.backend.mappers.BankAccountMapperImpl;
import com.fouadev.backend.security.repo.AppRoleRepository;
import com.fouadev.backend.security.repo.AppUserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@AllArgsConstructor
public class UserServiceImpl implements UserService {
    private AppUserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private BankAccountMapperImpl mapper;
    private AppRoleRepository appRoleRepository;

    @Override
    public AppUserDTO loadUserByUsername(String username) {
        AppUser user = userRepository.findByUsername(username);
        AppUserDTO userDTO = mapper.fromAppUser(user);
        return userDTO;
    }

    @Override
    public AppUserDTO updatePassword(String username, AppUserDTO userDTO) {

        AppUser user = userRepository.findByUsername(username);

        if (user == null) throw new UsernameNotFoundException("user not found");

        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));

        AppUser appUser = userRepository.save(user);

        AppUserDTO updatedPassword = mapper.fromAppUser(appUser);

        return updatedPassword;
    }

    @Override
    public AppUserDTO addNewUser(AppUserDTO userDTO) {

        AppUser user = userRepository.findByUsername(userDTO.getUsername());

        if (user != null) throw new RuntimeException("User Already Exist!");

        AppUser appUser = mapper.fromAppUserDTO(userDTO);
        appUser.setPassword(passwordEncoder.encode(userDTO.getPassword()));

        AppUser saveUser = userRepository.save(appUser);

        AppUserDTO appUserDTO = mapper.fromAppUser(saveUser);

        return appUserDTO;
    }

    @Override
    public AppRoleDTO addNewRole(String role, AppRoleDTO appRoleDTO) {

        AppRole appRole = appRoleRepository.findById(role).orElse(null);

        if (appRole != null) throw new RuntimeException("Role Already Exist !");

        AppRole appRole1 = mapper.fromAppRoleDTO(appRoleDTO);

        AppRole saveRole = appRoleRepository.save(appRole1);

        AppRoleDTO roleDTO = mapper.fromAppRole(saveRole);

        return roleDTO;
    }

    @Override
    public void addRoleToUser(String username, String role) {

        AppUser user = userRepository.findByUsername(username);

        AppRole appRole = appRoleRepository.findById(role).orElse(null);

        user.getRoles().add(appRole);
    }

    @Override
    public void removeRoleFromUser(String username, String role) {

    }

    @Override
    public List<AppUserDTO> getUsers() {
        List<AppUser> appUsers = userRepository.findAll();
        List<AppUserDTO> appUserDTOS = appUsers.stream()
                .map(appUser -> mapper.fromAppUser(appUser))
                .toList();
        return appUserDTOS;
    }
}