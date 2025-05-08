package com.portal_do_aluno.repositories;

import com.portal_do_aluno.domain.Aluno;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AlunoRepository extends JpaRepository<Aluno, Long> {
}
