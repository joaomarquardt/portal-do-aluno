package com.portal_do_aluno.repositories;

import com.portal_do_aluno.domain.Turma;
import com.portal_do_aluno.domain.TurmaStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TurmaRepository extends JpaRepository<Turma, Long> {
    int countByCodigoStartingWith(String prefixo);

    @Modifying
    @Query("UPDATE Turma t SET t.status = 'ENCERRADA' WHERE t.status = 'ATIVA' and t.periodo like %:periodo%")
    void updateStatusToClosed(@Param("periodo") String periodo);

    Optional<List<Turma>> findByStatus(TurmaStatus status);

    @Query("SELECT m.valor FROM Media m WHERE m.turma.status = :status")
    List<Double> findValuesByStatus(@Param("status") TurmaStatus status);

}
