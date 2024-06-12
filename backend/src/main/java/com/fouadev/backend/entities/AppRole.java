package com.fouadev.backend.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/*
 Created by : Fouad SAIDI on 12/06/2024
 @author : Fouad SAIDI
 @date : 12/06/2024
 @project : e-banking
*/
@Entity(name = "roles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppRole {
    @Id
    private String role;
}