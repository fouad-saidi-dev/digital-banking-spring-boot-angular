package com.fouadev.backend;

import com.fouadev.backend.dtos.BankAccountDTO;
import com.fouadev.backend.dtos.CurrentBankAccountDTO;
import com.fouadev.backend.dtos.CustomerDTO;
import com.fouadev.backend.dtos.SavingBankAccountDTO;
import com.fouadev.backend.entities.*;
import com.fouadev.backend.enums.AccountStatus;
import com.fouadev.backend.enums.OperationType;
import com.fouadev.backend.exceptions.BalanceNotSufficientException;
import com.fouadev.backend.exceptions.BankAccountNotFoundException;
import com.fouadev.backend.exceptions.CustomerNotFoundException;
import com.fouadev.backend.repositories.AccountOperationRepository;
import com.fouadev.backend.repositories.BankAccountRepository;
import com.fouadev.backend.repositories.CustomerRepository;
import com.fouadev.backend.services.BankAccountService;
import com.fouadev.backend.services.BankService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Stream;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }


    //@Bean
    CommandLineRunner run(BankService bankService,
                          BankAccountService bankAccountService) {
        return args -> {
            Stream.of("Ahmed", "Aymane", "Hiba").forEach(name -> {
                CustomerDTO customer = new CustomerDTO();
                customer.setName(name);
                customer.setEmail(name + "@gmail.com");
                bankAccountService.saveCustomer(customer);
            });
            bankAccountService.listCustomers().forEach(cus -> {
                try {
                    bankAccountService.saveCurrentBankAccount(Math.random() * 90000, cus.getId(), 90000);
                    bankAccountService.saveSavingBankAccount(Math.random() * 120000, cus.getId(), 5.5);
                } catch (CustomerNotFoundException e) {
                    e.printStackTrace();
                }
            });

            List<BankAccountDTO> bankAccounts = bankAccountService.bankAccountList();
            for (BankAccountDTO bankAccount : bankAccounts) {
                String accountId;
                for (int i = 0; i < 10; i++) {
                    if (bankAccount instanceof CurrentBankAccountDTO){
                        accountId=((CurrentBankAccountDTO) bankAccount).getId();
                    } else {
                        accountId=((SavingBankAccountDTO) bankAccount).getId();
                    }
                    bankAccountService.credit(accountId, 10000 + Math.random() * 120000, "CREDIT");
                    try {
                        bankAccountService.debit(accountId, 1000 + Math.random() * 9000, "DEBIT");
                    } catch (BalanceNotSufficientException e) {
                        throw new RuntimeException(e);
                    }
                }
            }
        };
    }

    //@Bean
    CommandLineRunner start(CustomerRepository customerRepository,
                            BankAccountRepository bankAccountRepository,
                            AccountOperationRepository accountOperationRepository) {
        return args -> {
            Stream.of("Fouad", "Reda", "Mohammed").forEach(name -> {
                Customer customer = new Customer();
                customer.setName(name);
                customer.setEmail(name + "@gmail.com");
                customerRepository.save(customer);
            });
            customerRepository.findAll().forEach(cus -> {
                CurrentAccount currentAccount = new CurrentAccount();
                currentAccount.setId(UUID.randomUUID().toString());
                currentAccount.setBalance(Math.random() * 90000);
                currentAccount.setOverDraft(9000);
                currentAccount.setStatus(AccountStatus.CREATED);
                currentAccount.setCustomer(cus);
                currentAccount.setCreatedAt(new Date());
                bankAccountRepository.save(currentAccount);

                SavingAccount savingAccount = new SavingAccount();
                savingAccount.setId(UUID.randomUUID().toString());
                savingAccount.setBalance(Math.random() * 90000);
                savingAccount.setInterestRate(9000);
                savingAccount.setStatus(AccountStatus.CREATED);
                savingAccount.setCustomer(cus);
                savingAccount.setCreatedAt(new Date());
                bankAccountRepository.save(savingAccount);

            });

            bankAccountRepository.findAll().forEach(acc -> {
                for (int i = 0; i < 5; i++) {
                    AccountOperation operation = new AccountOperation();
                    operation.setOperationDate(new Date());
                    operation.setType(Math.random() > 0.5 ? OperationType.DEBIT : OperationType.CREDIT);
                    operation.setAmount(5000);
                    operation.setBankAccount(acc);
                    accountOperationRepository.save(operation);
                }
            });


        };
    }

}
