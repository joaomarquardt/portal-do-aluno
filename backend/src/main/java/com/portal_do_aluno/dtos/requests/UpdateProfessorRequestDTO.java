package com.portal_do_aluno.dtos.requests;
import jakarta.validation.constraints.NotBlank;

public record UpdateProfessorRequestDTO(
        @NotBlank String departamento
) {
}

