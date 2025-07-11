package com.portal_do_aluno.security.services;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.portal_do_aluno.domain.Usuario;
import com.portal_do_aluno.security.domain.PapelUsuario;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class TokenService {
    @Value("secret")
    private String secret;

    public String generateToken(Usuario usuario) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            List<String> papeis = usuario.getPapeis()
                    .stream()
                    .map(PapelUsuario::name)
                    .toList();
            return JWT.create()
                    .withIssuer("portal-do-aluno")
                    .withSubject(usuario.getUsername())
                    .withClaim("nome", usuario.getNome().split(" ")[0])
                    .withExpiresAt(Instant.now().plusSeconds(3600))
                    .withClaim("roles", papeis)
                    .sign(algorithm);
        } catch (JWTCreationException e) {
            throw new JWTCreationException("Erro ao gerar token", e);
        }
    }

    public String validateToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.require(algorithm)
                    .withIssuer("portal-do-aluno")
                    .build()
                    .verify(token)
                    .getSubject();
        } catch (JWTVerificationException e) {
            return "";
        }
    }

    public Instant getExpiration(String token) {
        return JWT.decode(token)
                .getExpiresAtAsInstant();
    }
}
