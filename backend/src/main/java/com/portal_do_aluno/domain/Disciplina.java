package com.portal_do_aluno.domain;

import jakarta.persistence.*;

import java.util.List;


@Entity
@Table(name = "disciplinas")
public class Disciplina {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String codigo;

    private String nome;

    @ManyToMany
    @JoinTable(
            name = "pre_requisitos",
            joinColumns = @JoinColumn(name = "disciplina_id"),
            inverseJoinColumns = @JoinColumn(name = "pre_requisito_id")
    )
    private List<Disciplina> preRequisitos;
    @ManyToOne
    @JoinColumn(name = "curso_id", nullable = false)
    private Curso curso;

    private int periodo;
    private int cargaHoraria;

    public Disciplina(String codigo, String nome, List<Disciplina> preRequisitos, Curso curso, int periodo, int cargaHoraria) {
        this.codigo = codigo;
        this.nome = nome;
        this.preRequisitos = preRequisitos;
        this.curso = curso;
        this.periodo = periodo;
        this.cargaHoraria = cargaHoraria;
    }

    public Disciplina() {
    }

    public Disciplina(Long id, String codigo, String nome, List<Disciplina> preRequisitos, Curso curso, int periodo, int cargaHoraria) {
        this.id = id;
        this.codigo = codigo;
        this.nome = nome;
        this.preRequisitos = preRequisitos;
        this.curso = curso;
        this.periodo = periodo;
        this.cargaHoraria = cargaHoraria;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public List<Disciplina> getPreRequisitos() {
        return preRequisitos;
    }

    public void setPreRequisitos(List<Disciplina> preRequisitos) {
        this.preRequisitos = preRequisitos;
    }

    public Curso getCurso() {
        return curso;
    }

    public void setCurso(Curso curso) {
        this.curso = curso;
    }

    public int getPeriodo() {
        return periodo;
    }

    public void setPeriodo(int periodo) {
        this.periodo = periodo;
    }

    public int getCargaHoraria() {
        return cargaHoraria;
    }

    public void setCargaHoraria(int cargaHoraria) {
        this.cargaHoraria = cargaHoraria;
    }
}
