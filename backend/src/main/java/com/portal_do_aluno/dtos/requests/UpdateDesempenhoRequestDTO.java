package com.portal_do_aluno.dtos.requests;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record UpdateDesempenhoRequestDTO(
        @NotNull(message = "O valor da média não pode ser nulo")
        @Min(value = 0, message = "A média deve ser no mínimo 0")
        @Max(value = 10, message = "A média deve ser no máximo 10")
        double valor,

        @NotNull(message = "As horas registradas não podem ser nulas")
        @Min(value = 0, message = "As horas registradas devem ser no mínimo 0")
        int horasRegistradas
) {
}