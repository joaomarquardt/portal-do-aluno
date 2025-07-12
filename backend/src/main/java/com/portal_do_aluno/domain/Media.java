package com.portal_do_aluno.domain;

import jakarta.persistence.*;


@Entity
@Table(name = "medias")
public class Media {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double valor = 0.0;

    @ManyToOne
    @JoinColumn(name = "aluno_id")
    private Aluno aluno;

    @ManyToOne
    @JoinColumn(name = "turma_id")
    private Turma turma;

    public Media(Double valor, Aluno aluno, Turma turma) {
        this.valor = valor;
        this.aluno = aluno;
        this.turma = turma;
    }

    public Media(Long id, Double valor, Aluno aluno, Turma turma) {
        this.id = id;
        this.valor = valor;
        this.aluno = aluno;
        this.turma = turma;
    }

    public Media() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getValor() {
        return valor;
    }

    public void setValor(Double valor) {
        this.valor = valor;
    }

    public Aluno getAluno() {
        return aluno;
    }

    public void setAluno(Aluno aluno) {
        this.aluno = aluno;
    }

    public Turma getTurma() {
        return turma;
    }

    public void setTurma(Turma turma) {
        this.turma = turma;
    }
}
