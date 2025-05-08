package com.portal_do_aluno.repositories;

import com.portal_do_aluno.domain.Presenca;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PresencaRepository extends JpaRepository<Presenca, Long> {
}
