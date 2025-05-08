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
@Table(name = "disciplinas")
public class Disciplina {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String codigo;

    private String nome;

    @ManyToMany
    @JoinTable(
            name = "disciplinas_pre_requisitos",
            joinColumns = @JoinColumn(name = "disciplina_id"),
            inverseJoinColumns = @JoinColumn(name = "pre_requisito_id")
    )
    private List<Disciplina> preRequisitos;

    @ManyToMany(mappedBy = "disciplinas")
    private List<Curso> cursos;

    private int periodo;
    private int vagasTotais;
    private int cargaHoraria;
}
