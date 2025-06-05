package com.portal_do_aluno.dtos.requests;

public record UpdatePresencaRequestDTO(
        int numeroPresencas,
        Long alunoID,
        Long turmaID
) {
}
