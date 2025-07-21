package com.portal_do_aluno.dtos.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record CreateDisciplinaRequestDTO(
        @NotBlank(message = "O código da disciplina não pode estar em branco")
        @Size(min = 3, max = 10, message = "O código deve ter entre 3 e 10 caracteres")
        String codigo,

        @NotBlank(message = "O nome da disciplina não pode estar em branco")
        String nome,

        @NotNull(message = "O período não pode ser nulo")
        @Positive(message = "O período deve ser um número positivo")
        int periodo,

        @NotNull(message = "A carga horária não pode ser nula")
        @Positive(message = "A carga horária deve ser um número positivo")
        int cargaHoraria,

        @NotNull(message = "O ID do curso não pode ser nulo")
        Long cursoID
) {
}