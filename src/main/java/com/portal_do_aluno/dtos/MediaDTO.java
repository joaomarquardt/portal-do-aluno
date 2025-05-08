package com.portal_do_aluno.dtos;

public record MediaDTO(
        double valor,
        AlunoDTO aluno,
        TurmaDTO turma
) {
}
