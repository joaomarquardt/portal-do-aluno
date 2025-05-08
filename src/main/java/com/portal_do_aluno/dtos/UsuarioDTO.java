package com.portal_do_aluno.dtos;

public record UsuarioDTO(
        String nome,
        String cpf,
        String emailPessoal,
        String emailInstitucional,
        String telefone,
        String senha,
        AlunoDTO aluno,
        ProfessorDTO professor
) {
}
