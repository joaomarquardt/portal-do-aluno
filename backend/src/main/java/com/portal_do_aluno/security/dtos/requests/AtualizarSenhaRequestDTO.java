package com.portal_do_aluno.security.dtos.requests;

public record AtualizarSenhaRequestDTO(
        String senhaAtual,
        String senhaNova
) {
}
