package com.portal_do_aluno.dtos.requests;
import jakarta.validation.constraints.*;

public record CreateCursoRequestDTO(
        @NotBlank(message = "O nome do curso é obrigatório.")
        String nome,

        @NotBlank(message = "O tipo do curso é obrigatório.")
        String tipo,

        @Min(value = 1, message = "A duração deve ser de pelo menos 1 ano.")
        int anosDuracao,

        @NotBlank(message = "O turno é obrigatório.")
        String turno,

        @NotBlank(message = "O departamento é obrigatório.")
        String departamento
) {
}

