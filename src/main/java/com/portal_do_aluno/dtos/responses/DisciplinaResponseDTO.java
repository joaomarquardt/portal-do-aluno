package com.portal_do_aluno.dtos.responses;

public record DisciplinaResponseDTO(
        String codigo,
        String nome,
        int periodo,
        int vagasTotais,
        int cargaHoraria
) {
}
