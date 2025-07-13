package com.portal_do_aluno.dtos.requests;
import jakarta.validation.constraints.*;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateTurmaRequestDTO(
        @NotNull(message = "O ID da disciplina é obrigatório.")
        @Min(value = 1, message = "O ID da disciplina deve ser um valor positivo.")
        Long disciplinaID,

        @NotNull(message = "O ID do professor é obrigatório.")
        @Min(value = 1, message = "O ID do professor deve ser um valor positivo.")
        Long professorID,

        @Min(value = 1, message = "O número de vagas totais deve ser um valor positivo.")
        int vagasTotais, // 'int' é primitivo, então não pode ser null, apenas validamos o valor mínimo

        @NotBlank(message = "O horário da turma é obrigatório.")
        String horario
) {
}

