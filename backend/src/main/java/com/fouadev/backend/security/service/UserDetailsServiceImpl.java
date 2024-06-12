package com.fouadev.backend.security.service;


import com.fouadev.backend.dtos.AppUserDTO;
import com.fouadev.backend.entities.AppUser;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    private UserService userService;

    public UserDetailsServiceImpl(@Lazy UserService userService) {
        this.userService = userService;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AppUserDTO appUser = userService.loadUserByUsername(username);
        if (appUser == null) throw new UsernameNotFoundException("user not found");

        List<SimpleGrantedAuthority> authorities = appUser.getRoles().stream().map(role -> new SimpleGrantedAuthority(role.getRole())).toList();

        UserDetails userDetails = User
                .withUsername(appUser.getUsername())
                .password(appUser.getPassword())
                .authorities(authorities)
                .build();
        return userDetails;
    }
}