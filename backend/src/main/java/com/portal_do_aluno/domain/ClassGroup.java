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
@Table(name = "class_groups")
public class Turma {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String code;

    private String term;

    @ManyToOne
    @JoinColumn(name = "subject_id")
    private Subject subject;

    @ManyToOne
    @JoinColumn(name = "professor_id")
    private Professor professor;

    @ManyToMany
    @JoinTable(
            name = "students_class_groups",
            joinColumns = @JoinColumn(name = "class_group_id"),
            inverseJoinColumns = @JoinColumn(name = "aluno_id"))
    private List<Student> students;

    private int totalSeats;
    private String schedule;

    public Turma(String code, String term, Subject subject, Professor professor, List<Student> students, int totalSeats, String schedule) {
        this.code = code;
        this.term = term;
        this.subject = subject;
        this.professor = professor;
        this.totalSeats = totalSeats;
        this.students = students;
        this.schedule = schedule;
    }
}
