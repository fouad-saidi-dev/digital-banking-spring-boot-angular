package com.fouadev.backend.exceptions;
/*
 Created by : Fouad SAIDI on 23/05/2024
 @author : Fouad SAIDI
 @date : 23/05/2024
 @project : e-banking
*/

public class BalanceNotSufficientException extends Throwable {
    public BalanceNotSufficientException(String message) {
        super(message);
    }
}