package com.portal_do_aluno.dtos.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record UpdateCursoRequestDTO(
        @NotBlank(message = "O nome do curso não pode estar em branco")
        String nome,

        @NotBlank(message = "O tipo do curso não pode estar em branco")
        String tipo,

        @NotNull(message = "A duração em anos não pode ser nula")
        @Positive(message = "A duração deve ser um número positivo")
        int anosDuracao,

        @NotBlank(message = "O turno não pode estar em branco")
        String turno,

        @NotBlank(message = "O departamento não pode estar em branco")
        String departamento
) {
}