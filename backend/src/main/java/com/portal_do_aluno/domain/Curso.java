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
    private int anosDuracao;
    private String turno;
    private String departamento;

    @OneToMany(mappedBy = "curso")
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

    public Curso() {
    }

    public Curso(Long id, String nome, String tipo, int anosDuracao, String turno, String departamento, List<Disciplina> disciplinas, List<Aluno> alunos, List<Professor> professores) {
        this.id = id;
        this.nome = nome;
        this.tipo = tipo;
        this.anosDuracao = anosDuracao;
        this.turno = turno;
        this.departamento = departamento;
        this.disciplinas = disciplinas;
        this.alunos = alunos;
        this.professores = professores;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public int getAnosDuracao() {
        return anosDuracao;
    }

    public void setAnosDuracao(int anosDuracao) {
        this.anosDuracao = anosDuracao;
    }

    public String getTurno() {
        return turno;
    }

    public void setTurno(String turno) {
        this.turno = turno;
    }

    public String getDepartamento() {
        return departamento;
    }

    public void setDepartamento(String departamento) {
        this.departamento = departamento;
    }

    public List<Disciplina> getDisciplinas() {
        return disciplinas;
    }

    public void setDisciplinas(List<Disciplina> disciplinas) {
        this.disciplinas = disciplinas;
    }

    public List<Aluno> getAlunos() {
        return alunos;
    }

    public void setAlunos(List<Aluno> alunos) {
        this.alunos = alunos;
    }

    public List<Professor> getProfessores() {
        return professores;
    }

    public void setProfessores(List<Professor> professores) {
        this.professores = professores;
    }
}
