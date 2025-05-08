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
public class Professor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String siape;

    private String departamento;

    @OneToMany(mappedBy = "professor")
    private List<Turma> turmas;

    @OneToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;
}
