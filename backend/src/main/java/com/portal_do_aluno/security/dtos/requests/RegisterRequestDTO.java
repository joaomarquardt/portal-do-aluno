package com.portal_do_aluno.security.dtos.requests;

import com.portal_do_aluno.dtos.requests.CreateAlunoRequestDTO;
import com.portal_do_aluno.dtos.requests.CreateProfessorRequestDTO;
import com.portal_do_aluno.security.domain.PapelUsuario;

import java.util.List;

public record RegisterRequestDTO(
        String nome,
        String cpf,
        String emailPessoal,
        String emailInstitucional,
        String telefone,
        String senha,
        CreateAlunoRequestDTO aluno,
        CreateProfessorRequestDTO professor,
        List<PapelUsuario> papeis
) {
}