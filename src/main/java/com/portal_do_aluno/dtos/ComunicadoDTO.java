package com.portal_do_aluno.dtos;

import java.time.LocalDateTime;

public record ComunicadoDTO(
        String titulo,
        String mensagem,
        LocalDateTime dataPublicacao
) {
}
