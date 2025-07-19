package com.portal_do_aluno.security.dtos.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AtualizarSenhaRequestDTO(
        String senhaAtual, // Pode ser nula se for a primeira troca de senha obrigatória

        @NotBlank(message = "A nova senha não pode estar em branco")
        @Size(min = 4, message = "A nova senha deve ter no mínimo 4 caracteres")
        String senhaNova
) {
}