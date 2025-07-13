package com.portal_do_aluno.dtos.responses;

public record DesempenhoResponseDTO(
        TurmaDesempenhoResponseDTO turma,
        Double valor,
        Integer horasRegistradas
) {
}
