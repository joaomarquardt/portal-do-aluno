package com.portal_do_aluno.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "academic_terms")
public class AcademicTerms {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int year;

    private int semester;

    private boolean active;

    private LocalDate startDate;

    private LocalDate endDate;

    public AcademicTerms(int year, int semester, boolean active, LocalDate startDate, LocalDate endDate) {
        this.year = year;
        this.semester = semester;
        this.active = active;
        this.startDate = startDate;
        this.endDate = endDate;
    }
}
