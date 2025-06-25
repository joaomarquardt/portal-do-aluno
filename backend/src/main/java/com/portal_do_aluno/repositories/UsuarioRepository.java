package com.portal_do_aluno.repositories;

import com.portal_do_aluno.domain.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByCpf(String cpf);

    Optional<Usuario> findByEmailInstitucional(String emailInstitucional);
}
