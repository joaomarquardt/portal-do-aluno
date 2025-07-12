package com.portal_do_aluno.repositories;

import com.portal_do_aluno.domain.Aluno;
import com.portal_do_aluno.domain.Media;
import com.portal_do_aluno.domain.Turma;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MediaRepository extends JpaRepository<Media, Long> {
    Optional<Media> findByAlunoAndTurma(Aluno aluno, Turma turma);

    @Query("SELECT m.valor FROM Media m WHERE m.aluno.id = :alunoId AND m.turma.id IN :turmaIds AND m.valor IS NOT NULL")
    List<Double> findByAlunoAndTurmas(@Param("alunoId") Long alunoId, @Param("turmaIds") List<Long> turmaIds);
}
