package com.portal_do_aluno.dtos.responses;

import com.portal_do_aluno.dtos.requests.CreateTurmaRequestDTO;

import java.util.List;

public record AlunoResponseDTO(
        String matricula,
        int periodoAtual,
        String periodoIngresso,
        CursoResponseDTO curso,
        List<CreateTurmaRequestDTO> turmas,
        boolean matriculado
) {
}
