package com.portal_do_aluno.dtos;

public record PresencaDTO(
        int numeroPresencas,
        AlunoDTO aluno,
        TurmaDTO turma
) {
}
