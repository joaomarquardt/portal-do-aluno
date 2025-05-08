package com.portal_do_aluno.repositories;

import com.portal_do_aluno.domain.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
}
