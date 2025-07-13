package com.portal_do_aluno.dtos.requests;
import jakarta.validation.constraints.*;

import jakarta.validation.constraints.NotBlank; // Importar para validar que a string não está vazia ou contém apenas espaços em branco

public record CreateComunicadoRequestDTO(
        @NotBlank(message = "O título do comunicado é obrigatório.") // Garante que o título não é nulo e não está vazio
        String titulo,

        @NotBlank(message = "A mensagem do comunicado é obrigatória.") // Garante que a mensagem não é nula e não está vazia
        String mensagem
) {
}
