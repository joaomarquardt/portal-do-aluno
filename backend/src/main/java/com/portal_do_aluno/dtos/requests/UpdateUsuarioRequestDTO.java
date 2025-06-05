package com.portal_do_aluno.dtos.requests;

public record UpdateUsuarioRequestDTO(
        String emailPessoal,
        String emailInstitucional,
        String telefone
) {
}
