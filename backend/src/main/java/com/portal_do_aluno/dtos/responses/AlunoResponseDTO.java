package com.portal_do_aluno.dtos.responses;

public record AlunoResponseDTO(
        Long id,
        String nome,
        String cpf,
        String emailPessoal,
        String emailInstitucional,
        String matricula,
        String telefone,
        int periodoAtual,
        String periodoIngresso,
        CursoResponseDTO curso,
        boolean matriculado
) {
}
