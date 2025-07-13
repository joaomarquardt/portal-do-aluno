package com.portal_do_aluno.dtos.requests;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record CreateAlunoRequestDTO(
        @NotNull(message = "O ID do curso é obrigatório.") // Garante que o cursoID não é null
        @Min(value = 1, message = "O ID do curso deve ser um valor positivo.") // Garante que o ID é 1 ou maior
        Long cursoID
) {
}
