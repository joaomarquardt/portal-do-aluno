package com.portal_do_aluno.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "usuarios")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;

    @Column(unique = true)
    private String cpf;

    private String emailPessoal;
    private String emailInstitucional;
    private String telefone;
    private String senha;

    @OneToOne(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    private Aluno aluno;

    @OneToOne(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    private Professor professor;

    public Usuario(String nome, String cpf, String emailPessoal, String emailInstitucional, String telefone, String senha, Aluno aluno, Professor professor) {
        this.nome = nome;
        this.cpf = cpf;
        this.emailPessoal = emailPessoal;
        this.emailInstitucional = emailInstitucional;
        this.telefone = telefone;
        this.senha = senha;
        this.aluno = aluno;
        this.professor = professor;
    }
}
