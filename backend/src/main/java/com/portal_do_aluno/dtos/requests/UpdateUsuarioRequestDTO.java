package com.portal_do_aluno.dtos.requests;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UpdateUsuarioRequestDTO(
        @NotBlank(message = "O e-mail pessoal não pode estar em branco")
        @Email(message = "Formato de e-mail pessoal inválido")
        String emailPessoal,

        @NotBlank(message = "O e-mail institucional não pode estar em branco")
        @Email(message = "Formato de e-mail institucional inválido")
        String emailInstitucional,

        @NotBlank(message = "O telefone não pode estar em branco")
        String telefone
) {
}