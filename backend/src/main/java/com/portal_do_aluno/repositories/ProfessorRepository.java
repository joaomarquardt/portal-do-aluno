package com.portal_do_aluno.repositories;

import com.portal_do_aluno.domain.Professor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProfessorRepository extends JpaRepository<Professor, Long> {
    Optional<Professor> findBySiape(String siape);
}
