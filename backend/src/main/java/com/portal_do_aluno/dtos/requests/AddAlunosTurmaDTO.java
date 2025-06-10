package com.portal_do_aluno.dtos.requests;

import java.util.List;

public record AddAlunosTurmaDTO(
        List<Long> idAlunos
) {
}
