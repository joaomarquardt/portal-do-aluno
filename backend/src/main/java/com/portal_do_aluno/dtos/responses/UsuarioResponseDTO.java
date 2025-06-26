package com.portal_do_aluno.dtos.responses;

import com.portal_do_aluno.security.domain.PapelUsuario;

import java.util.List;

public record UsuarioResponseDTO(
        String nome,
        String cpf,
        String emailPessoal,
        String emailInstitucional,
        String telefone,
        AlunoResponseDTO aluno,
        ProfessorResponseDTO professor,
        List<PapelUsuario> papeis
) {
}
