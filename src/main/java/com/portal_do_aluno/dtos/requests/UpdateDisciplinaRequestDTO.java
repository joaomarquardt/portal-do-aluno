package com.portal_do_aluno.dtos.requests;

public record UpdateDisciplinaRequestDTO(
        String nome,
        int periodo,
        int vagasTotais,
        int cargaHoraria
) {
}
