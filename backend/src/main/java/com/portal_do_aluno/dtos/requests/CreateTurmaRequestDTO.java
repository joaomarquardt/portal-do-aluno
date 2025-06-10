package com.portal_do_aluno.dtos.requests;

public record CreateTurmaRequestDTO(
        Long disciplinaID,
        Long professorID,
        int vagasTotais,
        String horario
) {
}
