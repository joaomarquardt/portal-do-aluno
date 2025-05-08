package com.portal_do_aluno.dtos;

import java.time.LocalTime;

public record TurmaDTO(
        String codigo,
        String periodo,
        DisciplinaDTO disciplina,
        ProfessorDTO professor,
        LocalTime horario
) {
}
