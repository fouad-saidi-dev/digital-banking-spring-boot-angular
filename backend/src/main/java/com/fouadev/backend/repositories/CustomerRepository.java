package com.fouadev.backend.repositories;

import com.fouadev.backend.entities.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    @Query("select c from Customer c where c.name like :kw")
    List<Customer> searchCustomerByName(@Param("kw") String keyword);
    @Query("select c from Customer c where c.name like :kw")
    Page<Customer> searchCustomerByName(@Param("kw") String keyword, Pageable pageable);
}
