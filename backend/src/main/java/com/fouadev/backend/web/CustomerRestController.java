package com.fouadev.backend.web;

import com.fouadev.backend.dtos.CustomerDTO;
import com.fouadev.backend.dtos.CustomerPageDTO;
import com.fouadev.backend.exceptions.CustomerNotFoundException;
import com.fouadev.backend.services.BankAccountService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/customers")
@Slf4j
@CrossOrigin("*")
public class CustomerRestController {
    private BankAccountService bankAccountService;

    public CustomerRestController(BankAccountService bankAccountService) {
        this.bankAccountService = bankAccountService;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('SCOPE_USER')")
    public List<CustomerDTO> customers() {
        return bankAccountService.listCustomers();
    }

    @GetMapping("/search")
    @PreAuthorize("hasAuthority('SCOPE_USER')")
    public List<CustomerDTO> searchCustomer(@RequestParam(name = "keyword",defaultValue = "") String keyword){
        return bankAccountService.searchCustomer("%"+keyword+"%");
    }
    @GetMapping(path = "/{id}")
    @PreAuthorize("hasAuthority('SCOPE_USER')")
    public CustomerDTO getCustomer(@PathVariable(name = "id") Long customerId) throws CustomerNotFoundException {
        return bankAccountService.getCustomer(customerId);
    }

    @PostMapping
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public CustomerDTO saveCustomer(@RequestBody CustomerDTO customerDTO) {
        return bankAccountService.saveCustomer(customerDTO);
    }

    @PutMapping(path = "/{customerId}")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public CustomerDTO updateCustomer(@PathVariable Long customerId, @RequestBody CustomerDTO customerDTO) {
        customerDTO.setId(customerId);
        return bankAccountService.updateCustomer(customerDTO);
    }

    @DeleteMapping("/{customerId}")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public void deleteCustomer(@PathVariable Long customerId) {
        bankAccountService.deleteCustomer(customerId);
    }

    @GetMapping("/searchPagination")
    @PreAuthorize("hasAuthority('SCOPE_USER')")
    public CustomerPageDTO searchCustomerPageable(@RequestParam(name = "keyword",defaultValue = "") String keyword,
                                                  @RequestParam(name = "page",defaultValue = "0") int page,
                                                  @RequestParam(name = "size",defaultValue = "5") int size){
        return bankAccountService.getCustomers("%"+keyword+"%",page,size);
    }
}