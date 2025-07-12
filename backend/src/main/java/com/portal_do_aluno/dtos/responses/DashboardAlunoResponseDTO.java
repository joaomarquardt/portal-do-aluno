package com.portal_do_aluno.dtos.responses;

public record DashboardAlunoResponseDTO(
        Integer numDisciplinasAtivas,
        Double mediaGeral,
        Integer presencaPorcentagem
) {
}
