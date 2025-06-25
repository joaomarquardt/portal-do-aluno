package com.portal_do_aluno.security.dtos.requests;

public record AuthRequestDTO(
        String cpf,
        String senha
) {
}
