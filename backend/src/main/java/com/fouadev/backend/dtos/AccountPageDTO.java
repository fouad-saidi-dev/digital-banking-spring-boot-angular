package com.fouadev.backend.dtos;

import lombok.Data;

import java.util.List;

@Data
public class AccountPageDTO {
    private int currentPage;
    private int totalPages;
    private int size;
    private List<BankAccountDTO> bankAccountDTOS;
}