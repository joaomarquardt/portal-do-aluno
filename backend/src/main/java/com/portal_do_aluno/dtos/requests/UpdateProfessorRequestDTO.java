package com.portal_do_aluno.dtos.requests;

public record UpdateProfessorRequestDTO(
        String departamento,
        String emailPessoal,
        String telefone
) {
}
