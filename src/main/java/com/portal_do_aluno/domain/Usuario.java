package com.portal_do_aluno.domain;

import jakarta.persistence.*;

@MappedSuperclass
public abstract class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;

    @Column(unique = true)
    private String cpf;

    private String email;
    private String emailInstitucional;
    private String telefone;
    private String senha;
}
