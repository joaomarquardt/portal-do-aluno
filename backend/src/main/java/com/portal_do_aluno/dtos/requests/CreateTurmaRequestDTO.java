package com.portal_do_aluno.dtos.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CreateTurmaRequestDTO(
        @NotNull(message = "O ID da disciplina não pode ser nulo")
        Long disciplinaID,

        @NotNull(message = "O ID do professor não pode ser nulo")
        Long professorID,

        @NotNull(message = "O número de vagas não pode ser nulo")
        @Positive(message = "O número de vagas deve ser positivo")
        int vagasTotais,

        @NotBlank(message = "O horário não pode estar em branco")
        String horario
) {
}