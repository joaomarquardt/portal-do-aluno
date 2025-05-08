package com.portal_do_aluno.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@Entity
@Table(name = "alunos")
public class Aluno {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String matricula;

    private int periodoAtual;
    private String periodoIngresso;

    @ManyToOne
    @JoinColumn(name = "curso_id", nullable = false)
    private Curso curso;

    @ManyToMany
    @JoinTable(
            name = "alunos_turmas",
            joinColumns = @JoinColumn(name = "aluno_id"),
            inverseJoinColumns = @JoinColumn(name = "turma_id")
    )
    private List<Turma> turmas;
    private boolean matriculado;

    @OneToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;
}
