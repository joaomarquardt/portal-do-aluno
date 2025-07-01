package com.portal_do_aluno.dtos.requests;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

public record CreatePeriodoLetivoRequestDTO(
        @Min(value = 2000, message = "Ano deve ser a partir de 2000.")
        int ano,

        @Min(value = 1) @Max(value = 2)
        int semestre,

        boolean ativo,

        @NotNull(message = "A data de início é obrigatória.")
        LocalDate dataInicio,

        @NotNull(message = "A data de fim é obrigatória.")
        LocalDate dataFim
) {
}

