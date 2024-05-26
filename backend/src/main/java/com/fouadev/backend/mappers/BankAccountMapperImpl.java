package com.fouadev.backend.mappers;
/*
 Created by : Fouad SAIDI on 24/05/2024
 @author : Fouad SAIDI
 @date : 24/05/2024
 @project : e-banking
*/

import com.fouadev.backend.dtos.AccountOperationDTO;
import com.fouadev.backend.dtos.CurrentBankAccountDTO;
import com.fouadev.backend.dtos.CustomerDTO;
import com.fouadev.backend.dtos.SavingBankAccountDTO;
import com.fouadev.backend.entities.AccountOperation;
import com.fouadev.backend.entities.CurrentAccount;
import com.fouadev.backend.entities.Customer;
import com.fouadev.backend.entities.SavingAccount;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

@Service
public class BankAccountMapperImpl {
    public CustomerDTO fromCustomer(Customer customer){
        CustomerDTO customerDTO = new CustomerDTO();
        BeanUtils.copyProperties(customer,customerDTO);
        return customerDTO;
    }

    public Customer fromCustomerDTO(CustomerDTO customerDTO){
        Customer customer = new Customer();
        BeanUtils.copyProperties(customerDTO,customer);
        return customer;
    }
    public CurrentAccount fromCurrentAccountDTO(CurrentBankAccountDTO currentBankAccountDTO){
        CurrentAccount currentAccount = new CurrentAccount();
        BeanUtils.copyProperties(currentBankAccountDTO,currentAccount);
        currentAccount.setCustomer(fromCustomerDTO(currentBankAccountDTO.getCustomerDTO()));
        return currentAccount;
    }
    public CurrentBankAccountDTO fromCurrentAccount(CurrentAccount currentAccount){
        CurrentBankAccountDTO currentBankAccountDTO = new CurrentBankAccountDTO();
        BeanUtils.copyProperties(currentAccount,currentBankAccountDTO);
        currentBankAccountDTO.setCustomerDTO(fromCustomer(currentAccount.getCustomer()));
        currentBankAccountDTO.setType(currentAccount.getClass().getSimpleName());
        return currentBankAccountDTO;
    }

    public SavingAccount fromSavingAccountDTO(SavingBankAccountDTO accountDTO){
        SavingAccount savingAccount = new SavingAccount();
        BeanUtils.copyProperties(accountDTO,savingAccount);
        savingAccount.setCustomer(fromCustomerDTO(accountDTO.getCustomerDTO()));
        return savingAccount;
    }
    public SavingBankAccountDTO fromSavingAccount(SavingAccount savingAccount){
        SavingBankAccountDTO accountDTO = new SavingBankAccountDTO();
        BeanUtils.copyProperties(savingAccount,accountDTO);
        accountDTO.setCustomerDTO(fromCustomer(savingAccount.getCustomer()));
        accountDTO.setType(savingAccount.getClass().getSimpleName());
        return accountDTO;
    }
    public AccountOperationDTO fromAccountOperation(AccountOperation accountOperation){
        AccountOperationDTO accountOperationDTO = new AccountOperationDTO();
        BeanUtils.copyProperties(accountOperation,accountOperationDTO);
        return accountOperationDTO;
    }
}