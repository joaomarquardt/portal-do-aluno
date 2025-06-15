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
@Table(name = "subjects")
public class Subject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String code;

    private String name;

    @ManyToMany
    @JoinTable(
            name = "prerequisites",
            joinColumns = @JoinColumn(name = "ubject_id"),
            inverseJoinColumns = @JoinColumn(name = "prerequisite_id")
    )
    private List<Subject> prerequisites;

    @ManyToMany
    @JoinTable(
            name = "courses_subjects",
            joinColumns = @JoinColumn(name = "course_id"),
            inverseJoinColumns = @JoinColumn(name = "subject_id")
    )
    private List<Course> courses;

    private int term;
    private int workload;

    public Subject(String code, String name, List<Subject> prerequisites, List<Course> courses, int term, int workload) {
        this.code = code;
        this.name = name;
        this.prerequisites = prerequisites;
        this.courses = courses;
        this.term = term;
        this.workload = workload;
    }
}
