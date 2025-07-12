package com.portal_do_aluno.dtos.responses;

public record AlunoResponseDTO(
        String nome,
        String emailInstitucional,
        String matricula,
        int periodoAtual,
        String periodoIngresso,
        CursoResponseDTO curso,
        boolean matriculado
) {
}
