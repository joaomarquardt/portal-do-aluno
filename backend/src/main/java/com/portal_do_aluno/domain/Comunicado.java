package com.portal_do_aluno.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;


@Entity
@Table(name = "comunicados")
public class Comunicado {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String titulo;
    private String mensagem;
    private LocalDateTime dataPublicacao = LocalDateTime.now().withNano(0);

    public Comunicado(String titulo, String mensagem, LocalDateTime dataPublicacao) {
        this.titulo = titulo;
        this.mensagem = mensagem;
        this.dataPublicacao = dataPublicacao;
    }

    public Comunicado() {
    }

    public Comunicado(Long id, String titulo, String mensagem, LocalDateTime dataPublicacao) {
        this.id = id;
        this.titulo = titulo;
        this.mensagem = mensagem;
        this.dataPublicacao = dataPublicacao;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getMensagem() {
        return mensagem;
    }

    public void setMensagem(String mensagem) {
        this.mensagem = mensagem;
    }

    public LocalDateTime getDataPublicacao() {
        return dataPublicacao;
    }

    public void setDataPublicacao(LocalDateTime dataPublicacao) {
        this.dataPublicacao = dataPublicacao;
    }
}
