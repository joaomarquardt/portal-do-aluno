package com.portal_do_aluno.dtos.responses;

public record UsuarioResponseDTO(
        String nome,
        String cpf,
        String emailPessoal,
        String emailInstitucional,
        String telefone,
        AlunoResponseDTO aluno,
        ProfessorResponseDTO professor
) {
}
