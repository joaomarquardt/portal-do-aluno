package com.portal_do_aluno.dtos.requests;

public record UpdateCursoRequestDTO(
        String nome,
        String tipo,
        int anosDuracao,
        String turno,
        String departamento
) {
}
