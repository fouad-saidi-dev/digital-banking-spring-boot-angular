package com.fouadev.backend.services;

import com.fouadev.backend.entities.BankAccount;
import com.fouadev.backend.entities.CurrentAccount;
import com.fouadev.backend.entities.SavingAccount;
import com.fouadev.backend.repositories.BankAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/*
 Created by : Fouad SAIDI on 22/05/2024
 @author : Fouad SAIDI
 @date : 22/05/2024
 @project : e-banking
*/
@Service
@Transactional
public class BankService {

    @Autowired
    private BankAccountRepository bankAccountRepository;

    public void consulter(){
        BankAccount bankAccount = bankAccountRepository.findById("04f2d01a-be28-46ac-97d5-d458d9b7dec2").orElse(null);
        System.out.println("**********************");
        System.out.println(bankAccount.getId());
        System.out.println(bankAccount.getBalance());
        System.out.println(bankAccount.getStatus());
        System.out.println(bankAccount.getCustomer().getName());
        System.out.println(bankAccount.getClass().getName());

        if (bankAccount instanceof CurrentAccount){
            System.out.println("OverDraft: "+((CurrentAccount)bankAccount).getOverDraft());
        } else if(bankAccount instanceof SavingAccount){
            System.out.println("InterestRate: "+((SavingAccount)bankAccount).getInterestRate());
        }
        bankAccount.getAccountOperations().forEach(ap -> {
            System.out.println(ap.getType()+"\t"+ap.getOperationDate()+"\t"+ap.getAmount());
        });
    }
}