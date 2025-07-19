package com.portal_do_aluno.dtos.requests;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record CreatePeriodoLetivoRequestDTO(
        @NotNull(message = "O ano não pode ser nulo")
        @Min(value = 2020, message = "O ano deve ser 2020 ou posterior")
        int ano,

        @NotNull(message = "O semestre não pode ser nulo")
        @Min(value = 1, message = "O semestre deve ser 1 ou 2")
        @Max(value = 2, message = "O semestre deve ser 1 ou 2")
        int semestre,

        boolean ativo,

        @NotNull(message = "A data de início não pode ser nula")
        LocalDate dataInicio,

        @NotNull(message = "A data de fim não pode ser nula")
        LocalDate dataFim
) {
}