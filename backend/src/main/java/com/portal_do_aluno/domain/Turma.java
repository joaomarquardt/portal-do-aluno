package com.portal_do_aluno.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;


@Entity
@Table(name = "turmas")
public class Turma {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String codigo;

    private String periodo;

    @ManyToOne
    @JoinColumn(name = "disciplina_id")
    private Disciplina disciplina;

    @ManyToOne
    @JoinColumn(name = "professor_id")
    private Professor professor;

    @ManyToMany
    @JoinTable(
            name = "alunos_turmas",
            joinColumns = @JoinColumn(name = "turma_id"),
            inverseJoinColumns = @JoinColumn(name = "aluno_id"))
    private List<Aluno> alunos;

    private int vagasTotais;
    private String horario;
    @Enumerated(EnumType.STRING)
    private TurmaStatus status = TurmaStatus.ATIVA;

    public Turma(String codigo, String periodo, Disciplina disciplina, Professor professor, List<Aluno> alunos, int vagasTotais, String horario) {
        this.codigo = codigo;
        this.periodo = periodo;
        this.disciplina = disciplina;
        this.professor = professor;
        this.vagasTotais = vagasTotais;
        this.alunos = alunos;
        this.horario = horario;
    }

    public boolean isValidAttendanceHours(int horas) {
        return horas >= 0 && this.getDisciplina().getCargaHoraria() >= horas;
    }

    public Turma() {
    }

    public Turma(Long id, String codigo, String periodo, Disciplina disciplina, Professor professor, List<Aluno> alunos, int vagasTotais, String horario, TurmaStatus status) {
        this.id = id;
        this.codigo = codigo;
        this.periodo = periodo;
        this.disciplina = disciplina;
        this.professor = professor;
        this.alunos = alunos;
        this.vagasTotais = vagasTotais;
        this.horario = horario;
        this.status = status;
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

    public String getPeriodo() {
        return periodo;
    }

    public void setPeriodo(String periodo) {
        this.periodo = periodo;
    }

    public Disciplina getDisciplina() {
        return disciplina;
    }

    public void setDisciplina(Disciplina disciplina) {
        this.disciplina = disciplina;
    }

    public Professor getProfessor() {
        return professor;
    }

    public void setProfessor(Professor professor) {
        this.professor = professor;
    }

    public List<Aluno> getAlunos() {
        return alunos;
    }

    public void setAlunos(List<Aluno> alunos) {
        this.alunos = alunos;
    }

    public int getVagasTotais() {
        return vagasTotais;
    }

    public void setVagasTotais(int vagasTotais) {
        this.vagasTotais = vagasTotais;
    }

    public String getHorario() {
        return horario;
    }

    public void setHorario(String horario) {
        this.horario = horario;
    }

    public TurmaStatus getStatus() {
        return status;
    }

    public void setStatus(TurmaStatus status) {
        this.status = status;
    }
}
