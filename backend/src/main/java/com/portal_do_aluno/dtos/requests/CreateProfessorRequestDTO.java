package com.portal_do_aluno.dtos.requests;
import jakarta.validation.constraints.*;

public record CreateProfessorRequestDTO(
        @NotBlank(message = "O SIAPE é obrigatório.")
        String siape,

        @NotBlank(message = "O departamento é obrigatório.")
        String departamento
) {
}

