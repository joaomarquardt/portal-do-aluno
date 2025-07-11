package com.portal_do_aluno.domain;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "professores")
public class Professor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String siape;

    private String departamento;

    @OneToMany(mappedBy = "professor")
    private List<Turma> turmas;

    @OneToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    public Professor(String siape, String departamento, List<Turma> turmas, Usuario usuario) {
        this.siape = siape;
        this.departamento = departamento;
        this.turmas = turmas;
        this.usuario = usuario;
    }

    public Professor(Long id, String siape, String departamento, List<Turma> turmas, Usuario usuario) {
        this.id = id;
        this.siape = siape;
        this.departamento = departamento;
        this.turmas = turmas;
        this.usuario = usuario;
    }

    public Professor() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSiape() {
        return siape;
    }

    public void setSiape(String siape) {
        this.siape = siape;
    }

    public String getDepartamento() {
        return departamento;
    }

    public void setDepartamento(String departamento) {
        this.departamento = departamento;
    }

    public List<Turma> getTurmas() {
        return turmas;
    }

    public void setTurmas(List<Turma> turmas) {
        this.turmas = turmas;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
}
