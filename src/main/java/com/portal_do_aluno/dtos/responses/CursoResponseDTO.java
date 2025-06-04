package com.portal_do_aluno.dtos.responses;

public record CursoResponseDTO(
        String nome,
        String tipo,
        int anosDuracao,
        String turno,
        String departamento
) {
}
