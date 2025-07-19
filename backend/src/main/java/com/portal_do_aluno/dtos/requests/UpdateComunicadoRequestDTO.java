package com.portal_do_aluno.dtos.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateComunicadoRequestDTO(
        @NotBlank(message = "O título não pode estar em branco")
        @Size(max = 255, message = "O título deve ter no máximo 255 caracteres")
        String titulo,

        @NotBlank(message = "A mensagem não pode estar em branco")
        String mensagem
) {
}