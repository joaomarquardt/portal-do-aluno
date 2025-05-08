package com.portal_do_aluno.dtos;

public record CursoDTO(
        String nome,
        String tipo,
        int anosDuracao,
        String turno,
        String departamento
) {
}
