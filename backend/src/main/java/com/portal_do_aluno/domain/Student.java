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
@Table(name = "students")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String registrationNumber;

    private int currentTerm = 1;
    private String enrollmentSemester;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private course course;

    @ManyToMany(mappedBy = "students")
    private List<ClassGroup> classGroups;
    private boolean enrolled= true;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    public Student(String registrationNumber, String enrollmentSemester, course course, List<ClassGroup> classGroups, user user) {
        this.registrationNumber = registrationNumber;
        this.enrollmentSemester = enrollmentSemester;
        this.course = course;
        this.classGroups = classGroups;
        this.user = user;
    }
}
