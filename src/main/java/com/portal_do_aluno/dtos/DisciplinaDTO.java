package com.portal_do_aluno.dtos;

public record DisciplinaDTO(
        String codigo,
        String nome,
        int periodo,
        int vagasTotais,
        int cargaHoraria
) {
}
