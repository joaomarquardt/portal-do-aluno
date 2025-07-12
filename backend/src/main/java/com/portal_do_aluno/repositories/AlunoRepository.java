package com.portal_do_aluno.repositories;

import com.portal_do_aluno.domain.Aluno;
import com.portal_do_aluno.domain.Curso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface AlunoRepository extends JpaRepository<Aluno, Long> {

    int countByCursoAndPeriodoIngresso(Curso curso, String periodoIngresso);

    Optional<Aluno> findByMatricula(String matricula);

    long countByMatriculado(Boolean matriculado);

    @Query("""
    SELECT a.periodoAtual
    FROM Aluno a
    GROUP BY a.periodoAtual
    ORDER BY COUNT(a) DESC
    """)
    List<Integer> findMostCommonPeriod();
}
