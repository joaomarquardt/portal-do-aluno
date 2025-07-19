package com.portal_do_aluno.dtos.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record UpdateDisciplinaRequestDTO(
        @NotBlank(message = "O nome da disciplina não pode estar em branco")
        String nome,

        @NotNull(message = "O período não pode ser nulo")
        @Positive(message = "O período deve ser um número positivo")
        int periodo,

        @NotNull(message = "O número de vagas não pode ser nulo")
        @Positive(message = "O número de vagas deve ser positivo")
        int vagasTotais,

        @NotNull(message = "A carga horária não pode ser nula")
        @Positive(message = "A carga horária deve ser um número positivo")
        int cargaHoraria
) {
}