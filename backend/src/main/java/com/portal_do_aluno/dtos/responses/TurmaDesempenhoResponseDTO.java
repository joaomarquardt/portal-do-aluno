package com.portal_do_aluno.dtos.responses;

public record TurmaDesempenhoResponseDTO(
        String codigo,
        String nomeDisciplina,
        String periodo,
        String horario,
        String nomeProfessor,
        Integer cargaHoraria
) {
}
