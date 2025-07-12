package com.portal_do_aluno.domain;

import jakarta.persistence.*;


@Entity
@Table(name = "presencas")
public class Presenca {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int horasRegistradas = 0;

    @ManyToOne
    @JoinColumn(name = "aluno_id")
    private Aluno aluno;

    @ManyToOne
    @JoinColumn(name = "turma_id")
    private Turma turma;

    public Presenca(int horasRegistradas, Aluno aluno, Turma turma) {
        this.horasRegistradas = horasRegistradas;
        this.aluno = aluno;
        this.turma = turma;
    }

    public Presenca() {
    }

    public Presenca(Long id, int horasRegistradas, Aluno aluno, Turma turma) {
        this.id = id;
        this.horasRegistradas = horasRegistradas;
        this.aluno = aluno;
        this.turma = turma;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getHorasRegistradas() {
        return horasRegistradas;
    }

    public void setHorasRegistradas(int horasRegistradas) {
        this.horasRegistradas = horasRegistradas;
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
