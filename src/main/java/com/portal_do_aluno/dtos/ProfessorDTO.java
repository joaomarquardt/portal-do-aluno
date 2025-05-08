package com.portal_do_aluno.dtos;

import java.util.List;

public record ProfessorDTO(
        String siape,
        String departamento,
        List<TurmaDTO> turmas
) {
}
