package com.portal_do_aluno.dtos.requests;

import jakarta.validation.constraints.NotBlank; // Importar para validar que a string não está vazia ou contém apenas espaços em branco
import jakarta.validation.constraints.Pattern;  // Importar para validar formato com regex
import jakarta.validation.constraints.Size;    // Importar para validar o tamanho da string

public record CreateProfessorRequestDTO(
        @NotBlank(message = "O SIAPE é obrigatório.")
        @Size(min = 7, max = 7, message = "O SIAPE deve conter exatamente 7 dígitos.") // Garante o tamanho
        @Pattern(regexp = "^\\d{7}$", message = "O SIAPE deve conter apenas números.") // Garante que são apenas dígitos
        String siape,

        @NotBlank(message = "O departamento é obrigatório.")
        String departamento
) {
}
