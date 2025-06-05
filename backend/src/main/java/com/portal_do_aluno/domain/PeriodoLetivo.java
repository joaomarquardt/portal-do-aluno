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
@Table(name = "periodos_letivos")
public class PeriodoLetivo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int ano;

    private int semestre;

    private boolean ativo;

    private LocalDate dataInicio;

    private LocalDate dataFim;

    public PeriodoLetivo(int ano, int semestre, boolean ativo, LocalDate dataInicio, LocalDate dataFim) {
        this.ano = ano;
        this.semestre = semestre;
        this.ativo = ativo;
        this.dataInicio = dataInicio;
        this.dataFim = dataFim;
    }
}
