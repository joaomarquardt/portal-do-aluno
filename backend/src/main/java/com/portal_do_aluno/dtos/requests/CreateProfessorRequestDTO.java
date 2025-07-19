package com.portal_do_aluno.dtos.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateProfessorRequestDTO(
        @NotBlank(message = "O SIAPE não pode estar em branco")
        @Size(min = 6, max = 10, message = "O SIAPE deve ter entre 6 e 10 caracteres")
        String siape,

        @NotBlank(message = "O departamento não pode estar em branco")
        String departamento
) {
}