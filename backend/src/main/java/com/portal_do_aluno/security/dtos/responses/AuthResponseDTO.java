package com.portal_do_aluno.security.dtos.responses;

public record AuthResponseDTO(
        String token,
        Boolean precisaRedefinirSenha
) {
}
