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

    public Professor(String siape, String departamento, List<Turma> turmas, Usuario usuario) {
        this.siape = siape;
        this.departamento = departamento;
        this.turmas = turmas;
        this.usuario = usuario;
    }
}
