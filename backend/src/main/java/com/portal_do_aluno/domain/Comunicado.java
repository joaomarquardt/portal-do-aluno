package com.portal_do_aluno.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "comunicados")
public class Comunicado {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String titulo;
    private String mensagem;
    private LocalDateTime dataPublicacao;

    public Comunicado(String titulo, String mensagem, LocalDateTime dataPublicacao) {
        this.titulo = titulo;
        this.mensagem = mensagem;
        this.dataPublicacao = dataPublicacao;
    }
}
