package com.portal_do_aluno.dtos.requests;

public record UpdateDesempenhoRequestDTO(
        double valor,
        int horasRegistradas
) {
}
