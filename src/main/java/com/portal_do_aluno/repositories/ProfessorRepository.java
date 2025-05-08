package com.portal_do_aluno.repositories;

import com.portal_do_aluno.domain.Professor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfessorRepository extends JpaRepository<Professor, Long> {
}
