package com.portal_do_aluno.dtos.requests;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record AddAlunosTurmaDTO(
        @NotNull(message = "A lista de IDs de alunos não pode ser nula.") // Garante que a lista não é null
        @NotEmpty(message = "A lista de IDs de alunos não pode estar vazia. Inclua pelo menos um aluno.") // Garante que a lista não está vazia
        List<Long> idAlunos
) {
}

