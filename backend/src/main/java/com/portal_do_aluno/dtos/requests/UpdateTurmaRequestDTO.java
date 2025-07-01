package com.portal_do_aluno.dtos.requests;
import jakarta.validation.constraints.NotNull;

public record UpdateTurmaRequestDTO(
        @NotNull Long professorID
) {
}

