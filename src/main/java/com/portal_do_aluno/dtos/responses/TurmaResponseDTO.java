package com.portal_do_aluno.dtos.responses;

import java.util.List;

public record TurmaResponseDTO(
        String codigo,
        String periodo,
        String horario,
        DisciplinaResponseDTO disciplina,
        ProfessorResponseDTO professor,
        List<AlunoResponseDTO> alunos
) {
}
