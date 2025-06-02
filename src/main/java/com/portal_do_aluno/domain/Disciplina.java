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
            name = "pre_requisitos",
            joinColumns = @JoinColumn(name = "disciplina_id"),
            inverseJoinColumns = @JoinColumn(name = "pre_requisito_id")
    )
    private List<Disciplina> preRequisitos;

    @ManyToMany
    @JoinTable(
            name = "disciplinas_cursos",
            joinColumns = @JoinColumn(name = "curso_id"),
            inverseJoinColumns = @JoinColumn(name = "disciplina_id")
    )
    private List<Curso> cursos;

    private int periodo;
    private int vagasTotais;
    private int cargaHoraria;

    public Disciplina(String codigo, String nome, List<Disciplina> preRequisitos, List<Curso> cursos, int periodo, int vagasTotais, int cargaHoraria) {
        this.codigo = codigo;
        this.nome = nome;
        this.preRequisitos = preRequisitos;
        this.cursos = cursos;
        this.periodo = periodo;
        this.vagasTotais = vagasTotais;
        this.cargaHoraria = cargaHoraria;
    }
}
