package com.fouadev.backend.exceptions;


public class CustomerNotFoundException extends Exception{
    public CustomerNotFoundException(String message) {
        super(message);
    }
}