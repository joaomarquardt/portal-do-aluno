package com.portal_do_aluno.dtos.requests;
import jakarta.validation.constraints.NotBlank;

import jakarta.validation.constraints.Email;   // Importar para validar formato de e-mail
import jakarta.validation.constraints.NotBlank; // Importar para validar que a string não está vazia ou contém apenas espaços em branco
import jakarta.validation.constraints.Pattern;  // Importar para validar formato com regex
import jakarta.validation.constraints.Size;    // Importar para validar o tamanho da string

public record UpdateProfessorRequestDTO(

        @NotBlank(message = "O departamento é obrigatório.")
        String departamento,

        @NotBlank(message = "O email pessoal é obrigatório.")
        @Email(message = "Formato de email pessoal inválido.")
        String emailPessoal,

        @NotBlank(message = "O telefone é obrigatório.")
        @Size(min = 11, max = 11, message = "O telefone deve conter exatamente 11 dígitos (DDD + número).") // Garante o tamanho
        @Pattern(regexp = "^\\d{11}$", message = "O telefone deve conter apenas números.") // Garante que são apenas dígitos
        String telefone
) {
}

