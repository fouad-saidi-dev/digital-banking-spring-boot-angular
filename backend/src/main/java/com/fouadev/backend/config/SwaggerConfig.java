package com.fouadev.backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/*
 Created by : Fouad SAIDI on 09/06/2024
 @author : Fouad SAIDI
 @date : 09/06/2024
 @project : e-banking
*/
@Configuration
public class SwaggerConfig {
    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .addSecurityItem(new SecurityRequirement().addList("BearerToken"))
                .components(new io.swagger.v3.oas.models.Components()
                        .addSecuritySchemes("BearerToken", new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                        )
                );
    }
}