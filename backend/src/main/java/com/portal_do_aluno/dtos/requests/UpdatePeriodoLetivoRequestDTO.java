package com.portal_do_aluno.dtos.requests;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.FutureOrPresent;
import java.time.LocalDate;

public record UpdatePeriodoLetivoRequestDTO(
        // 'boolean' primitivo é por padrão @NotNull, então não precisamos da anotação explícita.
        boolean ativo,

        @NotNull(message = "A data de fim é obrigatória.")
        @FutureOrPresent(message = "A data de fim não pode ser no passado.")
        LocalDate dataFim
) {
    // Não há validações inter-campos aqui, pois 'dataInicio' não está presente nesta DTO.
    // A lógica de 'dataFim' ser posterior a 'dataInicio' seria tratada no serviço,
    // onde a data de início original do período seria conhecida.
}
