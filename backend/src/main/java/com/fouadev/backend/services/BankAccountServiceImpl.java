package com.fouadev.backend.services;

import com.fouadev.backend.dtos.*;
import com.fouadev.backend.entities.*;
import com.fouadev.backend.enums.AccountStatus;
import com.fouadev.backend.enums.OperationType;
import com.fouadev.backend.exceptions.BalanceNotSufficientException;
import com.fouadev.backend.exceptions.BankAccountNotFoundException;
import com.fouadev.backend.exceptions.CustomerNotFoundException;
import com.fouadev.backend.mappers.BankAccountMapperImpl;
import com.fouadev.backend.repositories.AccountOperationRepository;
import com.fouadev.backend.repositories.BankAccountRepository;
import com.fouadev.backend.repositories.CustomerRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
@AllArgsConstructor
@Slf4j
public class BankAccountServiceImpl implements BankAccountService {

    private CustomerRepository customerRepository;
    private BankAccountRepository bankAccountRepository;
    private AccountOperationRepository accountOperationRepository;
    private BankAccountMapperImpl mapper;

    @Override
    public CustomerDTO saveCustomer(CustomerDTO customerDTO) {
        log.info("saving new Customer");

        Customer customer = mapper.fromCustomerDTO(customerDTO);

        Customer saveCustomer = customerRepository.save(customer);

        CustomerDTO dto = mapper.fromCustomer(saveCustomer);

        return dto;
    }

    @Override
    public CurrentBankAccountDTO saveCurrentBankAccount(double initialBalance, Long customerId, double overDraft) throws CustomerNotFoundException {

        Customer customer = customerRepository.findById(customerId).orElse(null);

        if (customer == null)
            throw new CustomerNotFoundException("Customer not found");

        CurrentAccount currentAccount = new CurrentAccount();
        currentAccount.setId(UUID.randomUUID().toString());
        currentAccount.setCreatedAt(new Date());
        currentAccount.setBalance(initialBalance);
        currentAccount.setCustomer(customer);
        currentAccount.setOverDraft(overDraft);
        currentAccount.setStatus(AccountStatus.CREATED);
        CurrentAccount savedCurrentAccount = bankAccountRepository.save(currentAccount);

        CurrentBankAccountDTO currentBankAccountDTO = mapper.fromCurrentAccount(savedCurrentAccount);

        return currentBankAccountDTO;
    }

    @Override
    public SavingBankAccountDTO saveSavingBankAccount(double initialBalance, Long customerId, double interestRate) throws CustomerNotFoundException {

        Customer customer = customerRepository.findById(customerId).orElse(null);

        if (customer == null)
            throw new CustomerNotFoundException("Customer not found");

        SavingAccount savingAccount = new SavingAccount();

        savingAccount.setId(UUID.randomUUID().toString());
        savingAccount.setCreatedAt(new Date());
        savingAccount.setBalance(initialBalance);
        savingAccount.setCustomer(customer);
        savingAccount.setInterestRate(interestRate);
        savingAccount.setStatus(AccountStatus.CREATED);

        SavingAccount savedSavingAccount = bankAccountRepository.save(savingAccount);

        SavingBankAccountDTO savingBankAccountDTO = mapper.fromSavingAccount(savedSavingAccount);

        return savingBankAccountDTO;
    }


    @Override
    public List<CustomerDTO> listCustomers() {
        List<Customer> customers = customerRepository.findAll();

        List<CustomerDTO> customerDTOS = customers.stream().map(customer -> mapper.fromCustomer(customer)).collect(Collectors.toList());

        return customerDTOS;
    }

    @Override
    public BankAccountDTO getBankAccount(String accountId) throws BankAccountNotFoundException {
        BankAccount bankAccount = bankAccountRepository.findById(accountId)
                .orElseThrow(() -> new BankAccountNotFoundException("BankAccount not found!"));
        if (bankAccount instanceof CurrentAccount) {
            CurrentAccount currentAccount = (CurrentAccount) bankAccount;
            return mapper.fromCurrentAccount(currentAccount);
        } else {
            SavingAccount savingAccount = (SavingAccount) bankAccount;
            return mapper.fromSavingAccount(savingAccount);
        }
    }

    @Override
    public void debit(String accountId, double amount, String description) throws BankAccountNotFoundException, BalanceNotSufficientException {

        BankAccount bankAccount = bankAccountRepository.findById(accountId)
                .orElseThrow(() -> new BankAccountNotFoundException("BankAccount not found!"));

        if (bankAccount.getBalance() < amount)
            throw new BalanceNotSufficientException("Balance not sufficient");

        AccountOperation operation = new AccountOperation();
        operation.setType(OperationType.DEBIT);
        operation.setBankAccount(bankAccount);
        operation.setDescription(description);
        operation.setAmount(amount);
        operation.setOperationDate(new Date());
        accountOperationRepository.save(operation);

        bankAccount.setBalance(bankAccount.getBalance() - amount);
        bankAccountRepository.save(bankAccount);
    }

    @Override
    public void credit(String accountId, double amount, String description) throws BankAccountNotFoundException {
        BankAccount bankAccount = bankAccountRepository.findById(accountId)
                .orElseThrow(() -> new BankAccountNotFoundException("BankAccount not found!"));


        AccountOperation operation = new AccountOperation();
        operation.setType(OperationType.CREDIT);
        operation.setBankAccount(bankAccount);
        operation.setDescription(description);
        operation.setAmount(amount);
        operation.setOperationDate(new Date());
        accountOperationRepository.save(operation);

        bankAccount.setBalance(bankAccount.getBalance() + amount);
        bankAccountRepository.save(bankAccount);
    }

    @Override
    public void transfer(String accountIdSource, String accountIdDestination, double amount) throws BankAccountNotFoundException, BalanceNotSufficientException {
        debit(accountIdSource, amount, "Transfer to " + accountIdDestination);
        credit(accountIdDestination, amount, "Transfer from " + accountIdSource);
    }

    @Override
    public List<BankAccountDTO> bankAccountList() {
        List<BankAccount> bankAccounts = bankAccountRepository.findAll();
        List<BankAccountDTO> bankAccountDTOS = bankAccounts.stream().map(bankAccount -> {
            if (bankAccount instanceof CurrentAccount) {
                CurrentAccount currentAccount = (CurrentAccount) bankAccount;
                return mapper.fromCurrentAccount(currentAccount);
            } else {
                SavingAccount savingAccount = (SavingAccount) bankAccount;
                return mapper.fromSavingAccount(savingAccount);
            }
        }).collect(Collectors.toList());

        return bankAccountDTOS;
    }

    @Override
    public CustomerDTO getCustomer(Long id) throws CustomerNotFoundException {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new CustomerNotFoundException("Customer not found"));
        return mapper.fromCustomer(customer);
    }

    @Override
    public CustomerDTO updateCustomer(CustomerDTO customerDTO) {
        log.info("saving update Customer");

        Customer customer = mapper.fromCustomerDTO(customerDTO);

        Customer saveCustomer = customerRepository.save(customer);

        CustomerDTO dto = mapper.fromCustomer(saveCustomer);

        return dto;
    }

    @Override
    public void deleteCustomer(Long customerId) {
        customerRepository.deleteById(customerId);
    }
    @Override
    public List<AccountOperationDTO> accountHistory(String accountId) {
        List<AccountOperation> accountOperations = accountOperationRepository.findByBankAccountId(accountId);
        List<AccountOperationDTO> accountOperationDTOS = accountOperations.stream()
                .map(accountOperation -> mapper.fromAccountOperation(accountOperation))
                .toList();
        return accountOperationDTOS;
    }

    @Override
    public AccountHistoryDTO getAccountHistory(String accountId, int page, int size) throws BankAccountNotFoundException {

        BankAccount bankAccount = bankAccountRepository.findById(accountId)
                .orElseThrow(() -> new BankAccountNotFoundException("Account not found"));

        Page<AccountOperation> accountOperations = accountOperationRepository.findByBankAccountId(accountId, PageRequest.of(page, size));

        AccountHistoryDTO accountHistoryDTO = new AccountHistoryDTO();
        List<AccountOperationDTO> accountOperationDTOS = accountOperations.getContent().stream().map(op -> mapper.fromAccountOperation(op)).collect(Collectors.toList());
        accountHistoryDTO.setAccountOperationDTOS(accountOperationDTOS);
        accountHistoryDTO.setAccountId(bankAccount.getId());
        accountHistoryDTO.setCurrentPage(page);
        accountHistoryDTO.setSize(size);
        accountHistoryDTO.setBalance(bankAccount.getBalance());
        accountHistoryDTO.setTotalPages(accountOperations.getTotalPages());

        return accountHistoryDTO;
    }

    @Override
    public List<CustomerDTO> searchCustomer(String keyword) {
        List<Customer> customers = customerRepository.searchCustomerByName(keyword);
        List<CustomerDTO> customerDTOS = customers.stream().map(customer -> mapper.fromCustomer(customer)).collect(Collectors.toList());
        return customerDTOS;
    }

    @Override
    public List<BankAccountDTO> getAccountsCustomer(Long customerId) {

        List<BankAccount> bankAccounts = bankAccountRepository.findByCustomerId(customerId);

        List<BankAccountDTO> bankAccountDTOS = bankAccounts.stream().map(bankAccount -> {
            if (bankAccount instanceof CurrentAccount) {
                CurrentAccount currentAccount = (CurrentAccount) bankAccount;
                return mapper.fromCurrentAccount(currentAccount);
            } else {
                SavingAccount savingAccount = (SavingAccount) bankAccount;
                return mapper.fromSavingAccount(savingAccount);
            }
        }).collect(Collectors.toList());

        return bankAccountDTOS;
    }

}