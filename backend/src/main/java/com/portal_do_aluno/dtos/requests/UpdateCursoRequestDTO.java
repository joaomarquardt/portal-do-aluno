package com.portal_do_aluno.dtos.requests;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UpdateCursoRequestDTO(
        @NotBlank(message = "O nome do curso é obrigatório.")
        String nome,

        @NotBlank(message = "O tipo do curso é obrigatório.")
        String tipo,

        @NotNull(message = "A duração em anos é obrigatória.")
        @Min(value = 1, message = "A duração em anos deve ser um valor positivo.")
        int anosDuracao,

        @NotBlank(message = "O turno do curso é obrigatório.")
        String turno,

        @NotBlank(message = "O departamento do curso é obrigatório.")
        String departamento
) {
}
