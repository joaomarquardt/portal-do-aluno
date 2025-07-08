package com.portal_do_aluno.security.services;

import com.portal_do_aluno.domain.Usuario;
import com.portal_do_aluno.repositories.UsuarioRepository;
import com.portal_do_aluno.security.dtos.requests.AuthRequestDTO;
import com.portal_do_aluno.security.dtos.requests.RegisterRequestDTO;
import com.portal_do_aluno.security.dtos.responses.AuthResponseDTO;
import com.portal_do_aluno.services.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;

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

    @Autowired
    private TokenCacheService tokenCacheService;

    public AuthResponseDTO login(AuthRequestDTO authDTO) {
        Usuario usuario = repository.findByCpf(authDTO.cpf()).orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado com CPF: " + authDTO.cpf()));
        var usuarioSenha = new UsernamePasswordAuthenticationToken(authDTO.cpf(), authDTO.senha());
        try {
            var auth = this.authenticationManager.authenticate(usuarioSenha);
            Usuario usuarioAuth = (Usuario) auth.getPrincipal();
            String token = tokenService.generateToken(usuarioAuth);
            return new AuthResponseDTO(token, usuario.isPrecisaRedefinirSenha());
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

    public void logout(String token) {
        if (token == null || token.isBlank()) {
            throw new IllegalArgumentException("Token não pode ser nulo ou vazio.");
        }
        String tokenLimpo = token.replace("Bearer ", "");
        Instant expirationTime = tokenService.getExpiration(tokenLimpo);
        long segundosTTL = Duration.between(Instant.now(), expirationTime).getSeconds();
        if (segundosTTL > 0) {
            tokenCacheService.invalidateToken(tokenLimpo);
        }
    }
}
