package com.portal_do_aluno.dtos.responses;

public record DashboardProfessorResponseDTO(
        Integer numTurmasAtivas,
        Long totalAlunosGerenciados,
        Double mediaAlunosGerenciados
) {
}
