package com.portal_do_aluno.dtos.requests;

import java.time.LocalDate;

public record CreatePeriodoLetivoRequestDTO(
        int ano,
        int semestre,
        boolean ativo,
        LocalDate dataInicio,
        LocalDate dataFim
) {
}
