package com.portal_do_aluno.security.dtos.requests;

import com.portal_do_aluno.dtos.requests.CreateAlunoRequestDTO;
import com.portal_do_aluno.dtos.requests.CreateProfessorRequestDTO;
import com.portal_do_aluno.security.domain.PapelUsuario;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import java.util.List;

public record RegisterRequestDTO(
        @NotBlank(message = "O nome não pode estar em branco")
        String nome,

        @NotBlank(message = "O CPF não pode estar em branco")
        @Size(min = 11, max = 11, message = "O CPF deve conter 11 dígitos")
        String cpf,

        @NotBlank(message = "O e-mail pessoal não pode estar em branco")
        @Email(message = "Formato de e-mail pessoal inválido")
        String emailPessoal,

        @NotBlank(message = "O e-mail institucional não pode estar em branco")
        @Email(message = "Formato de e-mail institucional inválido")
        String emailInstitucional,

        @NotBlank(message = "O telefone não pode estar em branco")
        String telefone,

        @NotBlank(message = "A senha não pode estar em branco")
        String senha,

        @Valid //validar o DTO aninhado
        CreateAlunoRequestDTO aluno,

        @Valid
        CreateProfessorRequestDTO professor,

        @NotEmpty(message = "A lista de papéis não pode estar vazia")
        List<PapelUsuario> papeis
) {
}