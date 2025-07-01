package com.portal_do_aluno.dtos.requests;
import jakarta.validation.constraints.*;

public record UpdateCursoRequestDTO(
        @NotBlank String nome,
        @NotBlank String tipo,
        @Min(1) int anosDuracao,
        @NotBlank String turno,
        @NotBlank String departamento
) {
}

