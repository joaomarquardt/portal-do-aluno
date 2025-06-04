package com.portal_do_aluno.dtos.requests;

public record CreateUsuarioRequestDTO(
        String nome,
        String cpf,
        String emailPessoal,
        String emailInstitucional,
        String telefone,
        String senha,
        CreateAlunoRequestDTO aluno,
        CreateProfessorRequestDTO professor
) {
}
