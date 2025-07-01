package com.portal_do_aluno.dtos.requests;
import jakarta.validation.constraints.*;

public record CreateTurmaRequestDTO(
        @NotNull(message = "ID da disciplina é obrigatório.")
        Long disciplinaID,

        @NotNull(message = "ID do professor é obrigatório.")
        Long professorID,

        @Min(value = 1, message = "A turma deve ter pelo menos 1 vaga.")
        int vagasTotais,

        @NotBlank(message = "O horário é obrigatório.")
        String horario
) {
}

