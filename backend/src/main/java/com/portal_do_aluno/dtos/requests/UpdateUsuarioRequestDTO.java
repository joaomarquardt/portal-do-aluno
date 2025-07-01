package com.portal_do_aluno.dtos.requests;
import jakarta.validation.constraints.*;

public record UpdateUsuarioRequestDTO(
        @Email(message = "Email pessoal inválido.")
        String emailPessoal,

        @Email(message = "Email institucional inválido.")
        String emailInstitucional,

        @Pattern(regexp = "\\d{10,11}", message = "Telefone deve conter 10 ou 11 dígitos.")
        String telefone
) {
}

