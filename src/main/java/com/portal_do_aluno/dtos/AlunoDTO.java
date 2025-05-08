package com.portal_do_aluno.dtos;

import java.util.List;

public record AlunoDTO(
        String matricula,
        int periodoAtual,
        String periodoIngresso,
        CursoDTO curso,
        List<TurmaDTO> turmas,
        boolean matriculado
) {
}
