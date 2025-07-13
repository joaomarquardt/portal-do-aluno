package com.portal_do_aluno.dtos.requests;
import jakarta.validation.constraints.*;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull; // Embora 'double' e 'int' primitivos não possam ser nulos,
// é bom lembrar para tipos wrapper como 'Double' e 'Integer'.

public record UpdateDesempenhoRequestDTO(
        // Para 'double', validamos o intervalo de valores.
        // Assumindo que 'valor' representa uma nota de 0.0 a 10.0
        @Min(value = 0, message = "O valor deve ser no mínimo 0.")
        @Max(value = 10, message = "O valor deve ser no máximo 10.")
        double valor,

        // Para 'int', validamos o intervalo de valores.
        // Assumindo que 'presenca' representa uma porcentagem de 0 a 100
        @Min(value = 0, message = "A presença deve ser no mínimo 0%.")
        @Max(value = 100, message = "A presença deve ser no máximo 100%.")
        int presenca
) {
}

