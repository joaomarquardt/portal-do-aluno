package com.portal_do_aluno.dtos.excel;

import com.alibaba.excel.annotation.ExcelProperty;

public class AlunoExcelDTO {
    @ExcelProperty("Nome")
    private String nome;
    @ExcelProperty("Cpf")
    private String cpf;
    @ExcelProperty("Email pessoal")
    private String emailPessoal;
    @ExcelProperty("Email institucional")
    private String emailInstitucional;
    @ExcelProperty("Telefone")
    private String telefone;
    @ExcelProperty("ID Curso")
    private Integer idCurso;

    public AlunoExcelDTO(String nome, String cpf, String emailPessoal, String emailInstitucional, String telefone, Integer idCurso) {
        this.nome = nome;
        this.cpf = cpf;
        this.emailPessoal = emailPessoal;
        this.emailInstitucional = emailInstitucional;
        this.telefone = telefone;
        this.idCurso = idCurso;
    }

    public AlunoExcelDTO() {
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getEmailPessoal() {
        return emailPessoal;
    }

    public void setEmailPessoal(String emailPessoal) {
        this.emailPessoal = emailPessoal;
    }

    public String getEmailInstitucional() {
        return emailInstitucional;
    }

    public void setEmailInstitucional(String emailInstitucional) {
        this.emailInstitucional = emailInstitucional;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public Integer getIdCurso() {
        return idCurso;
    }

    public void setIdCurso(Integer idCurso) {
        this.idCurso = idCurso;
    }
}
