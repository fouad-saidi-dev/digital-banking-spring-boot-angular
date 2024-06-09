package com.fouadev.backend.web;

import com.fouadev.backend.dtos.*;
import com.fouadev.backend.entities.BankAccount;
import com.fouadev.backend.exceptions.BalanceNotSufficientException;
import com.fouadev.backend.exceptions.BankAccountNotFoundException;
import com.fouadev.backend.services.BankAccountService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/accounts")
@CrossOrigin("*")
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
    @PostMapping("/debit")
    public DebitDTO debit(@RequestBody DebitDTO debitDTO) throws BankAccountNotFoundException, BalanceNotSufficientException {
        bankAccountService.debit(debitDTO.getAccountId(),debitDTO.getAmount(), debitDTO.getDescription());
        return debitDTO;
    }
    @PostMapping("/credit")
    public CreditDTO credit(@RequestBody CreditDTO creditDTO) throws BankAccountNotFoundException {
        bankAccountService.credit(creditDTO.getAccountId(), creditDTO.getAmount(), creditDTO.getDescription());
        return creditDTO;
    }
    @PostMapping("/transfer")
    public TransferDTO transfer(@RequestBody TransferDTO transferDTO) throws BankAccountNotFoundException, BalanceNotSufficientException {
        bankAccountService.transfer(transferDTO.getAccountIdSource(),transferDTO.getAccountIdDestination(),transferDTO.getAmount());
        return transferDTO;
    }
    @GetMapping("/customer/{customerId}")
    public List<BankAccountDTO> bankAccountListCustomer(@PathVariable Long customerId) {
        return bankAccountService.getAccountsCustomer(customerId);
    }


}