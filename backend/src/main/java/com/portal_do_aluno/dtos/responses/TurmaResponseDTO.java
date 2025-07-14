package com.portal_do_aluno.dtos.responses;

public record TurmaResponseDTO(
        long id,
        String codigo,
        String periodo,
        int vagasTotais,
        String horario,
        DisciplinaResponseDTO disciplina,
        ProfessorResponseDTO professor
) {
}
