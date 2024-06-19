package com.fouadev.backend.security.repo;

import com.fouadev.backend.entities.AppRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface AppRoleRepository extends JpaRepository<AppRole,String> {
}
