package com.portal_do_aluno.security.dtos.requests;

import jakarta.validation.constraints.NotBlank;

public record AuthRequestDTO(
        @NotBlank(message = "O CPF não pode estar em branco")
        String cpf,

        @NotBlank(message = "A senha não pode estar em branco")
        String senha
) {
}