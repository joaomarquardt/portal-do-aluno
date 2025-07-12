package com.portal_do_aluno.dtos.responses;

public record DashboardAdminResponseDTO(
        Long totalAlunos,
        Double crMedio,
        Long numAlunosAltoDesempenho,
        Integer periodoMaisComum
) {
}
