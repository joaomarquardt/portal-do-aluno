package com.portal_do_aluno.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import java.util.List;

@Entity
@Table(name = "professores")
public class Professor extends Usuario {
    @Column(unique = true)
    private String siape;

    private String departamento;

    @OneToMany(mappedBy = "professor")
    private List<Turma> turmas;
}
