package com.portal_do_aluno.dtos.responses;

import com.portal_do_aluno.dtos.requests.CreateTurmaRequestDTO;
import com.portal_do_aluno.dtos.requests.CursoRequestDTO;

import java.util.List;

public record AlunoResponseDTO(
        String matricula,
        int periodoAtual,
        String periodoIngresso,
        CursoRequestDTO curso,
        List<CreateTurmaRequestDTO> turmas,
        boolean matriculado
) {
}
