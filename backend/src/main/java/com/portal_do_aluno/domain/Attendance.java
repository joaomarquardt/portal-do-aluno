package com.portal_do_aluno.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "attendances")
public class Attendance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int attendanceCount = 0;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne
    @JoinColumn(name = "classGroup_id")
    private ClassGroup classGroup;

    public Attendance(int attendanceCount, Student student, ClassGroup classGroup) {
        this.attendanceCount = attendanceCount;
        this.student = student;
        this.classGroup = classGroup;
    }
}
