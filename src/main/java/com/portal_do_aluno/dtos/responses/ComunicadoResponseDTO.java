package com.portal_do_aluno.dtos.responses;

import java.time.LocalDateTime;

public record ComunicadoResponseDTO(
        String titulo,
        String mensagem,
        LocalDateTime dataPublicacao
) {
}
