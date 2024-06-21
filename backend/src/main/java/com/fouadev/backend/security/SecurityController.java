package com.fouadev.backend.security;

import com.fouadev.backend.dtos.AppRoleDTO;
import com.fouadev.backend.dtos.AppUserDTO;
import com.fouadev.backend.mappers.BankAccountMapperImpl;
import com.fouadev.backend.security.requests.AppUserRequest;
import com.fouadev.backend.security.responses.AppUserResponse;
import com.fouadev.backend.security.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/auth")
public class SecurityController {
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtEncoder jwtEncoder;
    private UserService userService;
    private BankAccountMapperImpl mapper;
    public SecurityController(UserService userService, BankAccountMapperImpl mapper) {
        this.userService = userService;
        this.mapper = mapper;
    }

    @GetMapping("/profile")
    public Authentication authentication(Authentication authentication) {
        return authentication;
    }

    @PostMapping("/login")
    public Map<String, String> login(String username, String password) {

        Authentication authenticate = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
        );

        Instant instant = Instant.now();

        String scope = authenticate.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.joining(" "));

        JwtClaimsSet jwtClaimsSet = JwtClaimsSet.builder()
                .issuedAt(instant)
                .expiresAt(instant.plus(10, ChronoUnit.MINUTES))
                .subject(username)
                .claim("scope", scope)
                .build();

        JwtEncoderParameters jwtEncoderParameters = JwtEncoderParameters.from(
                JwsHeader.with(MacAlgorithm.HS512).build(),
                jwtClaimsSet
        );

        String jwt = jwtEncoder.encode(jwtEncoderParameters).getTokenValue();

        return Map.of("access_token", jwt);
    }
    @PostMapping("/addUser")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public AppUserResponse saveUser(@RequestBody AppUserRequest userRequest){
        AppUserDTO userDTO = mapper.fromAppUserRequest(userRequest);
        AppUserDTO appUserDTO = userService.addNewUser(userDTO);
        AppUserResponse userResponse = mapper.fromAppUserDTOResponse(appUserDTO);
        return userResponse;
    }

    @PutMapping("/editPassword/{username}")
    public AppUserResponse updatePassword(@PathVariable String username,@RequestBody AppUserRequest userRequest){
        AppUserDTO userDTO = mapper.fromAppUserRequest(userRequest);
        AppUserDTO appUserDTO = userService.updatePassword(username,userDTO);
        AppUserResponse userResponse = mapper.fromAppUserDTOResponse(appUserDTO);
        return userResponse;
    }

    @GetMapping("/users")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public List<AppUserResponse> getUsers(){
        List<AppUserDTO> appUserDTOS = userService.getUsers();
        List<AppUserResponse> userResponses = appUserDTOS.stream()
                .map(userDTO -> mapper.fromAppUserDTOResponse(userDTO))
                .toList();
        return userResponses;
    }
    @PostMapping("/newRole")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public AppRoleDTO newRole(@RequestBody AppRoleDTO appRoleDTO){
        return userService.addNewRole(appRoleDTO);
    }
    @PostMapping("/addRole")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public void addRoleToUser(@Param(value = "username") String username,
                              @Param(value = "role") String role){
        userService.addRoleToUser(username,role);
    }
    @DeleteMapping("/deleteRole")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public void removeRoleFromUser(@Param(value = "username") String username,
                                   @Param(value = "role") String role){
        userService.removeRoleFromUser(username,role);
    }
    @GetMapping("/roles/{username}")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public List<AppRoleDTO> getRolesByUser(@PathVariable String username){
        return userService.getRolesUser(username);
    }
}