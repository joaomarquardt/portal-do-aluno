package com.portal_do_aluno.repositories;

import com.portal_do_aluno.domain.Turma;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TurmaRepository extends JpaRepository<Turma, Long> {
    int countByCodigoStartingWith(String prefixo);

    @Modifying
    @Query("UPDATE Turma t SET t.status = 'ENCERRADA' WHERE t.status = 'ATIVA' and t.periodo like %:periodo%")
    void updateStatusToClosed(@Param("periodo") String periodo);
}
