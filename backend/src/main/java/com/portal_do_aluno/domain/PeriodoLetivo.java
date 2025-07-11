package com.portal_do_aluno.domain;

import jakarta.persistence.*;
import java.time.LocalDate;


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

    public PeriodoLetivo() {
    }

    public PeriodoLetivo(Long id, int ano, int semestre, boolean ativo, LocalDate dataInicio, LocalDate dataFim) {
        this.id = id;
        this.ano = ano;
        this.semestre = semestre;
        this.ativo = ativo;
        this.dataInicio = dataInicio;
        this.dataFim = dataFim;
    }

    public LocalDate getDataFim() {
        return dataFim;
    }

    public void setDataFim(LocalDate dataFim) {
        this.dataFim = dataFim;
    }

    public LocalDate getDataInicio() {
        return dataInicio;
    }

    public void setDataInicio(LocalDate dataInicio) {
        this.dataInicio = dataInicio;
    }

    public boolean isAtivo() {
        return ativo;
    }

    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }

    public int getSemestre() {
        return semestre;
    }

    public void setSemestre(int semestre) {
        this.semestre = semestre;
    }

    public int getAno() {
        return ano;
    }

    public void setAno(int ano) {
        this.ano = ano;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
