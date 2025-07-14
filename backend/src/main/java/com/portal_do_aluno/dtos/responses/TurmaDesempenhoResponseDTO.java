package com.portal_do_aluno.dtos.responses;

public record TurmaDesempenhoResponseDTO(
        Long id,
        String codigoTurma,
        String nomeDisciplina,
        String periodo,
        String horario,
        String nomeProfessor,
        Integer cargaHoraria
) {
}
