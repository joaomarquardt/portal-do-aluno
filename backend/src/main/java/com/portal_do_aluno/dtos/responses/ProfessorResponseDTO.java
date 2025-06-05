package com.portal_do_aluno.dtos.responses;

import com.portal_do_aluno.dtos.requests.CreateTurmaRequestDTO;

import java.util.List;

public record ProfessorResponseDTO(
        String siape,
        String departamento,
        List<CreateTurmaRequestDTO> turmas
) {
}
