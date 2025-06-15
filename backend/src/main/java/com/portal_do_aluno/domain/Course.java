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
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String type;
    private int durationYears;
    private String shift;
    private String department;

    @ManyToMany(mappedBy = "cursos")
    private List<Subject> subjects;

    @OneToMany(mappedBy = "curso")
    private List<Student> students;

    @ManyToMany
    @JoinTable(
            name = "cursos_professores",
            joinColumns = @JoinColumn(name = "curso_id"),
            inverseJoinColumns = @JoinColumn(name = "professor_id")
    )
    private List<Professor> professors;

    public Course(String name, String type, int durationYears, String shift, String department, List<Subject> subjects, List<Student> students, List<Professor> professors) {
        this.name = name;
        this.type = type;
        this.durationYears = durationYears;
        this.shift = shift;
        this.department = department;
        this.subjects = subjects;
        this.students = students;
        this.professors = professors;
    }
}
