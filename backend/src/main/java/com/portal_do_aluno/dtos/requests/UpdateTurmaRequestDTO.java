package com.portal_do_aluno.dtos.requests;

import jakarta.validation.constraints.NotNull;

public record UpdateTurmaRequestDTO(
        @NotNull(message = "O ID do professor não pode ser nulo")
        Long professorID
) {
}