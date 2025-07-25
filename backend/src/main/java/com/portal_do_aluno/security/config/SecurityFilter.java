package com.portal_do_aluno.security.config;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.portal_do_aluno.repositories.UsuarioRepository;
import com.portal_do_aluno.security.exceptions.InvalidTokenException;
import com.portal_do_aluno.security.services.TokenCacheService;
import com.portal_do_aluno.security.services.TokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class SecurityFilter extends OncePerRequestFilter {

    @Autowired
    private TokenService tokenService;

    @Autowired
    private TokenCacheService tokenCacheService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String token = extractToken(request);
        if (token != null) {
            try {
                String subject = tokenService.validateToken(token);
                if (!tokenCacheService.isTokenValid(token)) {
                    throw new InvalidTokenException("Token inválido ou expirado!");
                }
                UserDetails usuario = usuarioRepository.findByCpf(subject)
                        .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado com CPF: " + subject));
                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                        usuario, null, usuario.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(auth);
            } catch (JWTVerificationException | UsernameNotFoundException e) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Token inválido: " + e.getMessage());
                return;
            }
        }
        filterChain.doFilter(request, response);
    }


    protected String extractToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer")) {
            return header.substring(7);
        }
        return null;
    }
}