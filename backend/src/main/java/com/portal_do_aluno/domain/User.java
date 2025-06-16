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
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    @Column(unique = true)
    private String cpf;

    private String personalEmail;
    private String institutionalEmail;
    private String phone;
    private String password;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Student student;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Professor professor;

    public User(String name, String cpf, String personalEmail, String institutionalEmail, String phone, String password, Student student, Professor professor) {
        this.name = name;
        this.cpf = cpf;
        this.personalEmail = personalEmail;
        this.institutionalEmail = institutionalEmail;
        this.phone = phone;
        this.password = password;
        this.student = student;
        this.professor = professor;
    }
}
