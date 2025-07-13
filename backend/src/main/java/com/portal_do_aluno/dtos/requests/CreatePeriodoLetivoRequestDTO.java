package com.portal_do_aluno.dtos.requests;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.FutureOrPresent;
import java.time.LocalDate;

import com.portal_do_aluno.exceptions.InvalidDateRangeException;

public record CreatePeriodoLetivoRequestDTO(
        @NotNull(message = "O ano do período é obrigatório.")
        @Min(value = 2000, message = "O ano deve ser a partir de 2000.") // Exemplo de valor mínimo para o ano
        int ano,

        @NotNull(message = "O semestre do período é obrigatório.")
        @Min(value = 1, message = "O semestre deve ser 1 ou 2.")
        @Max(value = 2, message = "O semestre deve ser 1 ou 2.")
        int semestre,

        boolean ativo,

        @NotNull(message = "A data de início é obrigatória.")
        @FutureOrPresent(message = "A data de início não pode ser no passado.")
        LocalDate dataInicio,

        @NotNull(message = "A data de fim é obrigatória.")
        @FutureOrPresent(message = "A data de fim não pode ser no passado.")
        LocalDate dataFim
) {
    // Construtor canônico para records.
    // Adicionamos a validação inter-campos aqui.
    public CreatePeriodoLetivoRequestDTO {
        // Validação da lógica de datas: dataFim deve ser posterior a dataInicio
        if (dataInicio != null && dataFim != null && dataInicio.isAfter(dataFim)) {
            throw new InvalidDateRangeException("A data de início não pode ser posterior à data de fim.");
        }
    }
}

