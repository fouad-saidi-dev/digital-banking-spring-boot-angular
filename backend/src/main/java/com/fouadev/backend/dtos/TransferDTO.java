package com.fouadev.backend.dtos;

import lombok.Data;


@Data
public class TransferDTO {
    private String accountIdSource;
    private String accountIdDestination;
    private double amount;
}