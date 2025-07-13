package com.portal_do_aluno.dtos.responses;

public record ProfessorResponseDTO(
        Long id,
        String nome,
        String cpf,
        String emailPessoal,
        String emailInstitucional,
        String telefone,
        String siape,
        String departamento
) {
}
