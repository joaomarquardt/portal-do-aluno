package com.portal_do_aluno.repositories;

import com.portal_do_aluno.domain.Turma;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TurmaRepository extends JpaRepository<Turma, Long> {
    int countByCodigoStartingWith(String prefixo);
}
