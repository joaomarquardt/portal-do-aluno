package com.portal_do_aluno.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@Entity
@Table(name = "professores")
public class Professor extends Usuario {
    @Column(unique = true)
    private String siape;

    private String departamento;

    @OneToMany(mappedBy = "professor")
    private List<Turma> turmas;
}
