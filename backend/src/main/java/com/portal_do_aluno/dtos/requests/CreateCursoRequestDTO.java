package com.portal_do_aluno.dtos.requests;

public record CreateCursoRequestDTO(
        String nome,
        String tipo,
        int anosDuracao,
        String turno,
        String departamento
) {
}
