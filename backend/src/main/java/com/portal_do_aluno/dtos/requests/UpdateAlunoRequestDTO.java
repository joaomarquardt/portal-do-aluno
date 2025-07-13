package com.portal_do_aluno.dtos.requests;

public record UpdateAlunoRequestDTO(
        String emailPessoal,
        String telefone
) {
}
