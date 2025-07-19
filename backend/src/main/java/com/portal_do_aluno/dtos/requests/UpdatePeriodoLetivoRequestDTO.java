package com.portal_do_aluno.dtos.requests;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record UpdatePeriodoLetivoRequestDTO(
        boolean ativo,

        @NotNull(message = "A data de fim não pode ser nula")
        LocalDate dataFim
) {
}