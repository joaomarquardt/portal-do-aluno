package com.portal_do_aluno.repositories;

import com.portal_do_aluno.domain.PeriodoLetivo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PeriodoLetivoRepository extends JpaRepository<PeriodoLetivo, Long> {
    Optional<PeriodoLetivo> findByAtivoTrue();
}
