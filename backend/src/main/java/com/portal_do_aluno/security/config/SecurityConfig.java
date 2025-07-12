package com.portal_do_aluno.security.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private SecurityFilter securityFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        return httpSecurity
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.POST, "/auth/register", "/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/usuarios", "/").hasRole("ADMIN")
                        // alunos
                        .requestMatchers(HttpMethod.GET, "/alunos/**").hasAnyRole("ADMIN", "ALUNO")
                        .requestMatchers(HttpMethod.POST, "/alunos").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/alunos/**").hasAnyRole("ADMIN", "ALUNO")
                        .requestMatchers(HttpMethod.DELETE, "/alunos/**").hasRole("ADMIN")
                        // professores
                        .requestMatchers(HttpMethod.GET, "/professores/**").hasAnyRole("ADMIN", "PROFESSOR")
                        .requestMatchers(HttpMethod.POST, "/professores").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/professores/**").hasAnyRole("ADMIN", "PROFESSOR")
                        .requestMatchers(HttpMethod.DELETE, "/professores/**").hasRole("ADMIN")
                        // cursos e disciplinas
                        .requestMatchers("/cursos/**", "/disciplinas/**").hasRole("ADMIN")
                        // turmas
                        .requestMatchers(HttpMethod.GET, "/turmas/**").hasAnyRole("ADMIN", "ALUNO", "PROFESSOR")
                        .requestMatchers(HttpMethod.POST, "/turmas").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/turmas/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/turmas/**").hasRole("ADMIN")
                        // desempenho escolar
                        .requestMatchers(HttpMethod.GET, "/desempenho-escolar/**").hasRole("ALUNO")
                        // períodos letivos
                        .requestMatchers("/periodos-letivos", "/periodos-letivos/**").hasRole("ADMIN")
                        // comunicados
                        .requestMatchers(HttpMethod.GET, "/comunicados", "/comunicados").hasAnyRole("ADMIN", "ALUNO", "PROFESSOR")
                        .requestMatchers(HttpMethod.POST, "/comunicados").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/comunicados/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/comunicados/**").hasRole("ADMIN")
                        .anyRequest().authenticated())
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOrigin("http://localhost:8081");
        configuration.addAllowedMethod("GET");
        configuration.addAllowedMethod("POST");
        configuration.addAllowedMethod("PUT");
        configuration.addAllowedMethod("DELETE");
        configuration.addAllowedMethod("OPTIONS");
        configuration.addAllowedHeader("*");
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
