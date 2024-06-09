package com.fouadev.backend.repositories;

import com.fouadev.backend.entities.BankAccount;
import com.fouadev.backend.entities.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BankAccountRepository extends JpaRepository<BankAccount,String> {
    List<BankAccount> findByCustomerId(Long id);
}
