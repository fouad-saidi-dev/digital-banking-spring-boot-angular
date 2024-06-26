package com.fouadev.backend.dtos;



import com.fouadev.backend.enums.OperationType;
import lombok.Data;

import java.util.Date;

@Data
public class AccountOperationDTO {
    private Long id;
    private Date operationDate;
    private double amount;
    private OperationType type;
    private String description;
    private AppUserDTO userDTO;
}