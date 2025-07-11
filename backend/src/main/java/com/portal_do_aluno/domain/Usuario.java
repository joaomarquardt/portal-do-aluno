package com.portal_do_aluno.domain;

import com.portal_do_aluno.security.domain.PapelUsuario;
import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;


@Entity
@Table(name = "usuarios")
public class Usuario implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;

    @Column(unique = true)
    private String cpf;

    private String emailPessoal;
    private String emailInstitucional;
    private String telefone;
    private String senha;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "usuario_papeis", joinColumns = @JoinColumn(name = "usuario_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "papel")
    private List<PapelUsuario> papeis;

    @OneToOne(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    private Aluno aluno;

    @OneToOne(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    private Professor professor;

    private boolean precisaRedefinirSenha = true;

    public Usuario(String nome, String cpf, String emailPessoal, String emailInstitucional, String telefone, String senha, Aluno aluno, Professor professor) {
        this.nome = nome;
        this.cpf = cpf;
        this.emailPessoal = emailPessoal;
        this.emailInstitucional = emailInstitucional;
        this.telefone = telefone;
        this.senha = senha;
        this.aluno = aluno;
        this.professor = professor;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return papeis.stream()
                .map(papel -> new SimpleGrantedAuthority("ROLE_" + papel.name()))
                .collect(Collectors.toList());
    }

    @Override
    public String getPassword() {
        return senha;
    }

    @Override
    public String getUsername() {
        return cpf;
    }

    @Override
    public boolean isAccountNonExpired() {
        return UserDetails.super.isAccountNonExpired();
    }

    @Override
    public boolean isAccountNonLocked() {
        return UserDetails.super.isAccountNonLocked();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return UserDetails.super.isCredentialsNonExpired();
    }

    @Override
    public boolean isEnabled() {
        return UserDetails.super.isEnabled();
    }

    public Usuario() {
    }

    public Usuario(Long id, String nome, String cpf, String emailPessoal, String emailInstitucional, String telefone, String senha, List<PapelUsuario> papeis, Aluno aluno, Professor professor, boolean precisaRedefinirSenha) {
        this.id = id;
        this.nome = nome;
        this.cpf = cpf;
        this.emailPessoal = emailPessoal;
        this.emailInstitucional = emailInstitucional;
        this.telefone = telefone;
        this.senha = senha;
        this.papeis = papeis;
        this.aluno = aluno;
        this.professor = professor;
        this.precisaRedefinirSenha = precisaRedefinirSenha;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public List<PapelUsuario> getPapeis() {
        return papeis;
    }

    public void setPapeis(List<PapelUsuario> papeis) {
        this.papeis = papeis;
    }

    public Aluno getAluno() {
        return aluno;
    }

    public void setAluno(Aluno aluno) {
        this.aluno = aluno;
    }

    public Professor getProfessor() {
        return professor;
    }

    public void setProfessor(Professor professor) {
        this.professor = professor;
    }

    public boolean isPrecisaRedefinirSenha() {
        return precisaRedefinirSenha;
    }

    public void setPrecisaRedefinirSenha(boolean precisaRedefinirSenha) {
        this.precisaRedefinirSenha = precisaRedefinirSenha;
    }
}
