package com.portal_do_aluno.dtos.responses;

import java.time.LocalDate;

public record PeriodoLetivoResponseDTO(
        int ano,
        int semestre,
        boolean ativo,
        LocalDate dataInicio,
        LocalDate dataFim
) {
}
