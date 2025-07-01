package com.portal_do_aluno.dtos.requests;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public record AddAlunosTurmaDTO(
        @NotEmpty(message = "A lista de alunos não pode estar vazia.")
        List<Long> idAlunos
) {
}

