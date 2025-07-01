package com.portal_do_aluno.dtos.requests;
import jakarta.validation.constraints.*;

public record UpdateDesempenhoRequestDTO(
        @DecimalMin(value = "0.0", message = "O valor não pode ser negativo.")
        double valor,

        @Min(value = 0, message = "A presença não pode ser negativa.")
        @Max(value = 100, message = "A presença máxima é 100.")
        int presenca
) {
}

