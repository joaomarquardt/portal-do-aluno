package com.portal_do_aluno.dtos.requests;
import jakarta.validation.constraints.NotNull;

public record CreateAlunoRequestDTO(
        @NotNull(message = "O ID do curso é obrigatório.")
        Long cursoID
) {
}
