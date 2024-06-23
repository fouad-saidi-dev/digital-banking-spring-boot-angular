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
import com.fouadev.backend.security.repo.AppUserRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.awt.print.Pageable;
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
    private AppUserRepository userRepository;
    @Override
    public CustomerDTO saveCustomer(CustomerDTO customerDTO,String username) {
        log.info("saving new Customer");

        AppUser user = userRepository.findByUsername(username);

        Customer customer = mapper.fromCustomerDTO(customerDTO);
        customer.setUser(user);

        Customer saveCustomer = customerRepository.save(customer);

        CustomerDTO dto = mapper.fromCustomer(saveCustomer);

        return dto;
    }

    @Override
    public CurrentBankAccountDTO saveCurrentBankAccount(CurrentBankAccountDTO accountDTO,String username) throws CustomerNotFoundException {

        Customer customer = customerRepository.findById(accountDTO.getCustomerDTO().getId()).orElse(null);

        if (customer == null)
            throw new CustomerNotFoundException("Customer not found");

        AppUser user = userRepository.findByUsername(username);

        if (user == null)
            throw new UsernameNotFoundException("User not found!");

        CurrentAccount currentAccount = new CurrentAccount();
        currentAccount.setId(UUID.randomUUID().toString());
        currentAccount.setCreatedAt(new Date());
        currentAccount.setBalance(accountDTO.getBalance());
        currentAccount.setCustomer(customer);
        currentAccount.setOverDraft(accountDTO.getOverDraft());
        currentAccount.setStatus(AccountStatus.CREATED);
        currentAccount.setUser(user);
        CurrentAccount savedCurrentAccount = bankAccountRepository.save(currentAccount);

        CurrentBankAccountDTO currentBankAccountDTO = mapper.fromCurrentAccount(savedCurrentAccount);

        return currentBankAccountDTO;
    }

    @Override
    public SavingBankAccountDTO saveSavingBankAccount(SavingBankAccountDTO accountDTO,String username) throws CustomerNotFoundException {

        Customer customer = customerRepository.findById(accountDTO.getCustomerDTO().getId()).orElse(null);

        if (customer == null)
            throw new CustomerNotFoundException("Customer not found");

        AppUser user = userRepository.findByUsername(username);

        if (user == null)
            throw new UsernameNotFoundException("User not found!");

        SavingAccount savingAccount = new SavingAccount();

        savingAccount.setId(UUID.randomUUID().toString());
        savingAccount.setCreatedAt(new Date());
        savingAccount.setBalance(accountDTO.getBalance());
        savingAccount.setCustomer(customer);
        savingAccount.setInterestRate(accountDTO.getInterestRate());
        savingAccount.setUser(user);
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
    public void debit(String accountId, double amount, String description,String username) throws BankAccountNotFoundException, BalanceNotSufficientException {

        AppUser user = userRepository.findByUsername(username);

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
        operation.setUser(user);
        accountOperationRepository.save(operation);

        bankAccount.setBalance(bankAccount.getBalance() - amount);
        bankAccountRepository.save(bankAccount);
    }

    @Override
    public void credit(String accountId, double amount, String description,String username) throws BankAccountNotFoundException {

        AppUser user = userRepository.findByUsername(username);

        BankAccount bankAccount = bankAccountRepository.findById(accountId)
                .orElseThrow(() -> new BankAccountNotFoundException("BankAccount not found!"));


        AccountOperation operation = new AccountOperation();
        operation.setType(OperationType.CREDIT);
        operation.setBankAccount(bankAccount);
        operation.setDescription(description);
        operation.setAmount(amount);
        operation.setOperationDate(new Date());
        operation.setUser(user);
        accountOperationRepository.save(operation);

        bankAccount.setBalance(bankAccount.getBalance() + amount);
        bankAccountRepository.save(bankAccount);
    }

    @Override
    public void transfer(String accountIdSource, String accountIdDestination, double amount,String username) throws BankAccountNotFoundException, BalanceNotSufficientException {
        debit(accountIdSource, amount, "Transfer to " + accountIdDestination,username);
        credit(accountIdDestination, amount, "Transfer from " + accountIdSource,username);
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

    @Override
    public CustomerPageDTO getCustomers(String keyword, int page, int size) {

        Page<Customer> customers = customerRepository.searchCustomerByName(keyword, PageRequest.of(page, size));

        List<CustomerDTO> customerDTOS = customers.getContent().stream().map(customer -> mapper.fromCustomer(customer)).toList();

        CustomerPageDTO customerPageDTO = new CustomerPageDTO();

        customerPageDTO.setCustomerDTOS(customerDTOS);
        customerPageDTO.setCurrentPage(page);
        customerPageDTO.setSize(size);
        customerPageDTO.setTotalPages(customers.getTotalPages());

        return customerPageDTO;
    }

    @Override
    public List<AccountOperationDTO> accountOperationsList() {
        List<AccountOperation> accountOperations = accountOperationRepository.findAll();
        List<AccountOperationDTO> accountOperationDTOS = accountOperations
                .stream().map(accountOperation -> mapper.fromAccountOperation(accountOperation))
                .toList();
        return accountOperationDTOS;
    }

    @Override
    public AccountPageDTO getAccounts(String keyword, int page, int size) {

        Page<BankAccount> bankAccounts = bankAccountRepository.searchByCustomerName(keyword,PageRequest.of(page,size));

        List<BankAccountDTO> bankAccountDTOS = bankAccounts.stream().map(account -> {
            if (account instanceof CurrentAccount) {
                CurrentAccount currentAccount = (CurrentAccount) account;
                return mapper.fromCurrentAccount(currentAccount);
            } else {
                SavingAccount savingAccount = (SavingAccount) account;
                return mapper.fromSavingAccount(savingAccount);
            }
        }).toList();

        AccountPageDTO accountPageDTO = new AccountPageDTO();

        accountPageDTO.setCurrentPage(page);
        accountPageDTO.setSize(size);
        accountPageDTO.setTotalPages(bankAccounts.getTotalPages());
        accountPageDTO.setBankAccountDTOS(bankAccountDTOS);

        return accountPageDTO;
    }


}