package com.portal_do_aluno.dtos.requests;
import jakarta.validation.constraints.*;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateDisciplinaRequestDTO(
        @NotBlank(message = "O código da disciplina é obrigatório.")
        String codigo,

        @NotBlank(message = "O nome da disciplina é obrigatório.")
        String nome,

        @NotNull(message = "O período da disciplina é obrigatório.")
        @Min(value = 1, message = "O período da disciplina deve ser um valor positivo.")
        int periodo,

        @NotNull(message = "A carga horária da disciplina é obrigatória.")
        @Min(value = 1, message = "A carga horária da disciplina deve ser um valor positivo.")
        int cargaHoraria
) {
}

