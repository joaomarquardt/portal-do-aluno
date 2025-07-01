package com.portal_do_aluno.dtos.requests;
import jakarta.validation.constraints.NotBlank;

public record CreateComunicadoRequestDTO(
        @NotBlank(message = "O título é obrigatório.")
        String titulo,

        @NotBlank(message = "A mensagem é obrigatória.")
        String mensagem
) {
}

