package com.portal_do_aluno.dtos.requests;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record UpdateTurmaRequestDTO(
        @NotNull(message = "O ID do professor é obrigatório.") // Garante que o ID do professor não é nulo
        @Min(value = 1, message = "O ID do professor deve ser um valor positivo.") // Garante que o ID é 1 ou maior
        Long professorID
) {
}
