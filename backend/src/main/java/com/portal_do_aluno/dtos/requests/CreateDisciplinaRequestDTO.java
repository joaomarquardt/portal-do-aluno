package com.portal_do_aluno.dtos.requests;
import jakarta.validation.constraints.*;

public record CreateDisciplinaRequestDTO(
        @NotBlank(message = "O código é obrigatório.")
        String codigo,

        @NotBlank(message = "O nome é obrigatório.")
        String nome,

        @Min(value = 1, message = "O período deve ser pelo menos 1.")
        int periodo,

        @Min(value = 1, message = "A carga horária mínima é 1 hora.")
        int cargaHoraria
) {
}

