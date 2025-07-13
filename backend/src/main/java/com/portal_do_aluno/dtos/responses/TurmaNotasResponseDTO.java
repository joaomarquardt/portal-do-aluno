package com.portal_do_aluno.dtos.responses;

public record TurmaNotasResponseDTO(
        Long id,
        String nomeDisciplina,
        String codigoTurma
) {
}
