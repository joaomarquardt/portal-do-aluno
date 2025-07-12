package com.portal_do_aluno.dtos.requests;
import jakarta.validation.constraints.*;

public record CreateComunicadoRequestDTO(
        @NotBlank(message = "O título é obrigatório.")
        @Size(min = 5, max = 100, message = "O título deve ter entre 5 e 100 caracteres.")
        String titulo,

        @NotBlank(message = "A mensagem é obrigatória.")
        @Size(min = 10, max = 1000, message = "A mensagem deve ter entre 10 e 1000 caracteres.")
        String mensagem
) {
}

