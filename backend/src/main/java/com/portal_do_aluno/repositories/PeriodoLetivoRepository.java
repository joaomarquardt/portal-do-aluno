package com.portal_do_aluno.repositories;

import com.portal_do_aluno.domain.PeriodoLetivo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface PeriodoLetivoRepository extends JpaRepository<PeriodoLetivo, Long> {
    Optional<PeriodoLetivo> findByAtivoTrue();

    @Modifying
    @Query("UPDATE PeriodoLetivo p SET p.ativo = false WHERE p.ativo = true")
    void deactivateAllActive();
}
