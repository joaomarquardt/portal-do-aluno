package com.portal_do_aluno.domain;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "cursos")
public class Curso {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private String tipo;
    private int duracaoAnos;
    private String turno;
    private String departamento;

    @ManyToMany
    @JoinTable(
            name = "cursos_disciplinas",
            joinColumns = @JoinColumn(name = "curso_id"),
            inverseJoinColumns = @JoinColumn(name = "disciplina_id")
    )
    private List<Disciplina> disciplinas;

    @OneToMany(mappedBy = "curso")
    private List<Aluno> alunos;

    @ManyToMany
    @JoinTable(
            name = "cursos_professores",
            joinColumns = @JoinColumn(name = "curso_id"),
            inverseJoinColumns = @JoinColumn(name = "professor_id")
    )
    private List<Professor> professores;
}
