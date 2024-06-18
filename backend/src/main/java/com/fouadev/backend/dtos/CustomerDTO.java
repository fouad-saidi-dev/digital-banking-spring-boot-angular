package com.fouadev.backend.dtos;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data @AllArgsConstructor @NoArgsConstructor @Builder
public class CustomerDTO {
    private Long id;
    private String name;
    private String email;
    private AppUserDTO userDTO;
}