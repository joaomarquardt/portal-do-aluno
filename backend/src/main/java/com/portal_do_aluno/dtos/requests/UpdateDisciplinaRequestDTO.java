package com.portal_do_aluno.dtos.requests;
import jakarta.validation.constraints.*;

public record UpdateDisciplinaRequestDTO(
        @NotBlank String nome,
        @Min(1) int periodo,
        @Min(1) int vagasTotais,
        @Min(1) int cargaHoraria
) {
}

