package com.portal_do_aluno.dtos.responses;

import com.portal_do_aluno.domain.TurmaStatus;

public record TurmaResponseDTO(
        long id,
        String codigo,
        String periodo,
        int vagasTotais,
        String horario,
        TurmaStatus status,
        DisciplinaResponseDTO disciplina,
        ProfessorResponseDTO professor
) {
}
