package com.fouadev.backend.web;

import com.fouadev.backend.dtos.AccountHistoryDTO;
import com.fouadev.backend.dtos.AccountOperationDTO;
import com.fouadev.backend.dtos.BankAccountDTO;
import com.fouadev.backend.dtos.SavingBankAccountDTO;
import com.fouadev.backend.entities.BankAccount;
import com.fouadev.backend.exceptions.BankAccountNotFoundException;
import com.fouadev.backend.services.BankAccountService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/*
 Created by : Fouad SAIDI on 24/05/2024
 @author : Fouad SAIDI
 @date : 24/05/2024
 @project : e-banking
*/
@RestController
@RequestMapping("/accounts")
public class BankAccountRestAPI {
    private BankAccountService bankAccountService;

    public BankAccountRestAPI(BankAccountService bankAccountService) {
        this.bankAccountService = bankAccountService;
    }

    @GetMapping(path = "/{accountId}")
    public BankAccountDTO getBankAccount(@PathVariable String accountId) throws BankAccountNotFoundException {
        return bankAccountService.getBankAccount(accountId);
    }

    @GetMapping
    public List<BankAccountDTO> bankAccountList() {
        return bankAccountService.bankAccountList();
    }

    @GetMapping("/{accountId}/operations")
    public List<AccountOperationDTO> getHistory(@PathVariable String accountId) {
        return bankAccountService.accountHistory(accountId);
    }
    @GetMapping("/{accountId}/pageOperations")
    public AccountHistoryDTO getAccountHistory(@PathVariable String accountId,
                                                     @RequestParam(name = "page",defaultValue = "0") int page,
                                                     @RequestParam(name = "size",defaultValue = "5") int size) throws BankAccountNotFoundException {
       return bankAccountService.getAccountHistory(accountId,page,size);
    }

}