package com.portal_do_aluno.repositories;

import com.portal_do_aluno.domain.Curso;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CursoRepository extends JpaRepository<Curso, Long> {
}
