package com.portal_do_aluno.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "comunicados")
public class Comunicado {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String titulo;
    private String mensagem;
}
