package com.portal_do_aluno.dtos.requests;

import java.time.LocalDate;

public record UpdatePeriodoLetivoRequestDTO(
        boolean ativo,
        LocalDate dataFim
) {
}
