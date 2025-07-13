package com.portal_do_aluno.dtos.responses;

public record AlunoTurmaResponseDTO(
        Long id,
        String nome,
        String cpf,
        String emailPessoal,
        String emailInstitucional,
        String matricula,
        String telefone,
        int periodoAtual,
        String periodoIngresso
) {
}
