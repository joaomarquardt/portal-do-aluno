package com.portal_do_aluno.dtos.responses;

import com.portal_do_aluno.domain.TurmaStatus;

public record TurmaDesempenhoResponseDTO(
        Long id,
        TurmaStatus status,
        String codigoTurma,
        String nomeDisciplina,
        String periodo,
        String horario,
        String nomeProfessor,
        Integer cargaHoraria
) {
}
