package com.portal_do_aluno.dtos.requests;

public record CreateDisciplinaRequestDTO(
        String codigo,
        String nome,
        int periodo,
        int cargaHoraria
) {
}
