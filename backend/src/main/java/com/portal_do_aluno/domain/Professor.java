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
@Table(name = "professores")
public class Professor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String siape;

    private String department;

    @OneToMany(mappedBy = "professor")
    private List<ClassGroup> classGroup;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    public Professor(String siape, String department, List<ClassGroup> classGroup, User user) {
        this.siape = siape;
        this.department = department;
        this.classGroup = classGroup;
        this.user = user;
    }
}
