package com.portal_do_aluno.dtos.requests;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateProfessorRequestDTO(
        @NotBlank(message = "O departamento não pode estar em branco")
        String departamento,

        @NotBlank(message = "O e-mail pessoal não pode estar em branco")
        @Email(message = "Formato de e-mail inválido")
        String emailPessoal,

        @NotBlank(message = "O telefone não pode estar em branco")
        @Size(min = 10, max = 15, message = "O telefone deve ter entre 10 e 15 caracteres")
        String telefone
) {
}