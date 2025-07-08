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
}
