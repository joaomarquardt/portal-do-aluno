package com.portal_do_aluno.dtos.requests;
import jakarta.validation.constraints.NotNull;

public record UpdateAlunoRequestDTO(
        @NotNull(message = "O ID do curso é obrigatório.")
        Long cursoID
) {
}

