package com.portal_do_aluno.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;


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

    public Aluno() {
    }

    public Aluno(Long id, String matricula, int periodoAtual, String periodoIngresso, Curso curso, List<Turma> turmas, boolean matriculado, Usuario usuario) {
        this.id = id;
        this.matricula = matricula;
        this.periodoAtual = periodoAtual;
        this.periodoIngresso = periodoIngresso;
        this.curso = curso;
        this.turmas = turmas;
        this.matriculado = matriculado;
        this.usuario = usuario;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMatricula() {
        return matricula;
    }

    public void setMatricula(String matricula) {
        this.matricula = matricula;
    }

    public int getPeriodoAtual() {
        return periodoAtual;
    }

    public void setPeriodoAtual(int periodoAtual) {
        this.periodoAtual = periodoAtual;
    }

    public String getPeriodoIngresso() {
        return periodoIngresso;
    }

    public void setPeriodoIngresso(String periodoIngresso) {
        this.periodoIngresso = periodoIngresso;
    }

    public Curso getCurso() {
        return curso;
    }

    public void setCurso(Curso curso) {
        this.curso = curso;
    }

    public List<Turma> getTurmas() {
        return turmas;
    }

    public void setTurmas(List<Turma> turmas) {
        this.turmas = turmas;
    }

    public boolean isMatriculado() {
        return matriculado;
    }

    public void setMatriculado(boolean matriculado) {
        this.matriculado = matriculado;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
}
