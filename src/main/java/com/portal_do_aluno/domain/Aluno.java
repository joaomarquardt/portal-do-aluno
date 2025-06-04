package com.portal_do_aluno.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "alunos")
public class Aluno {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String matricula;

    private int periodoAtual = 1;
    private String periodoIngresso;

    @ManyToOne
    @JoinColumn(name = "curso_id", nullable = false)
    private Curso curso;

    @ManyToMany(mappedBy = "alunos")
    private List<Turma> turmas;
    private boolean matriculado = true;

    @OneToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    public Aluno(String matricula, String periodoIngresso, Curso curso, List<Turma> turmas, Usuario usuario) {
        this.matricula = matricula;
        this.periodoIngresso = periodoIngresso;
        this.curso = curso;
        this.turmas = turmas;
        this.usuario = usuario;
    }
}
