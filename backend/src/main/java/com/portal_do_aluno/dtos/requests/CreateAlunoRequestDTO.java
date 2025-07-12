package com.portal_do_aluno.dtos.requests;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

public record CreateAlunoRequestDTO(

        @NotBlank(message = "O nome não pode estar em branco.")
        @Size(min = 3, max = 100, message = "O nome deve ter entre 3 e 100 caracteres.")
        String nome,

        @NotBlank(message = "O email não pode estar em branco.")
        @Email(message = "Formato de email inválido.")
        @Size(max = 255, message = "O email não pode exceder 255 caracteres.")
        String email,

        @NotNull(message = "A data de nascimento é obrigatória.")
        @PastOrPresent(message = "A data de nascimento não pode ser futura.")
        LocalDate dataNascimento,

        @NotBlank(message = "O RA não pode estar em branco.")
        @Size(min = 9, max = 9, message = "O RA deve ter exatamente 9 dígitos.") // Exemplo para RA
        String ra,
        @NotNull(message = "O ID do curso é obrigatório.")
        Long cursoID
) {
}
