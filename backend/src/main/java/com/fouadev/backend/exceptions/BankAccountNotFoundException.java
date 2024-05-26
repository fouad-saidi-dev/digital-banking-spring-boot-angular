package com.fouadev.backend.exceptions;
/*
 Created by : Fouad SAIDI on 23/05/2024
 @author : Fouad SAIDI
 @date : 23/05/2024
 @project : e-banking
*/

public class BankAccountNotFoundException extends Exception {
    public BankAccountNotFoundException(String message) {
        super(message);
    }
}