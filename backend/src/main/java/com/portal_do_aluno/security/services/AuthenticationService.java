package com.portal_do_aluno.security.services;

import com.portal_do_aluno.domain.Usuario;
import com.portal_do_aluno.repositories.UsuarioRepository;
import com.portal_do_aluno.security.dtos.requests.AuthRequestDTO;
import com.portal_do_aluno.security.dtos.requests.RegisterRequestDTO;
import com.portal_do_aluno.services.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {
    @Autowired
    private UsuarioRepository repository;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TokenService tokenService;

    public String login(AuthRequestDTO authDTO) {
        repository.findByCpf(authDTO.cpf()).orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado com CPF: " + authDTO.cpf()));
        var usuarioSenha = new UsernamePasswordAuthenticationToken(authDTO.cpf(), authDTO.senha());
        try {
            var auth = this.authenticationManager.authenticate(usuarioSenha);
            return tokenService.generateToken((Usuario) auth.getPrincipal());
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("CPF e/ou senha inválidos.");
        }
    }

    public void register(RegisterRequestDTO registerDTO) {
        String senhaCriptografada = passwordEncoder.encode(registerDTO.senha());
        RegisterRequestDTO registerAtualizado = new RegisterRequestDTO(
                registerDTO.nome(), registerDTO.cpf(), registerDTO.emailPessoal(), registerDTO.emailInstitucional(),
                registerDTO.telefone(), senhaCriptografada, registerDTO.aluno(), registerDTO.professor(), registerDTO.papeis()
        );
        usuarioService.create(registerAtualizado);
    }

}
