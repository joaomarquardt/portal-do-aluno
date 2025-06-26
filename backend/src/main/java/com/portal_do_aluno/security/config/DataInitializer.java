package com.portal_do_aluno.security.config;

import com.portal_do_aluno.domain.Usuario;
import com.portal_do_aluno.repositories.UsuarioRepository;
import com.portal_do_aluno.security.domain.PapelUsuario;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Configuration
public class DataInitializer {
    @Value("${api.security.admin.password}")
    private String senhaAdmin;

    @Bean
    public CommandLineRunner initAdminUser(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (usuarioRepository.findByCpf("00000000000").isEmpty()) {
                Usuario admin = new Usuario();
                admin.setNome("Administrador");
                admin.setCpf("00000000000");
                admin.setSenha(passwordEncoder.encode(senhaAdmin));
                admin.setPapeis(List.of(PapelUsuario.ADMIN));
                usuarioRepository.save(admin);
                System.out.println("Usuário ADMIN criado com sucesso!");
            }
        };
    }
}
