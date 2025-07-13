package com.portal_do_aluno.dtos.responses;

public record DisciplinaResponseDTO(
        long id,
        String codigo,
        String nome,
        int periodo,
        int cargaHoraria
) {
}
