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
@Table(name = "cursos")
public class Curso {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private String tipo;
    private int anosDuracao;
    private String turno;
    private String departamento;

    @ManyToMany(mappedBy = "cursos")
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

    public Curso(String nome, String tipo, int anosDuracao, String turno, String departamento, List<Disciplina> disciplinas, List<Aluno> alunos, List<Professor> professores) {
        this.nome = nome;
        this.tipo = tipo;
        this.anosDuracao = anosDuracao;
        this.turno = turno;
        this.departamento = departamento;
        this.disciplinas = disciplinas;
        this.alunos = alunos;
        this.professores = professores;
    }
}
