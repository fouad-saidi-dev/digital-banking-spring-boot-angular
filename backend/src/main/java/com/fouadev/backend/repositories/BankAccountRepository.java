package com.fouadev.backend.repositories;

import com.fouadev.backend.entities.BankAccount;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BankAccountRepository extends JpaRepository<BankAccount,String> {
    List<BankAccount> findByCustomerId(Long id);
    @Query("select c from BankAccount c where c.customer.name like :kw")
    Page<BankAccount> searchByCustomerName(@Param("kw") String keyword, Pageable pageable);
}
