package com.portal_do_aluno.repositories;

import com.portal_do_aluno.domain.Aluno;
import com.portal_do_aluno.domain.Presenca;
import com.portal_do_aluno.domain.Turma;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PresencaRepository extends JpaRepository<Presenca, Long> {
    Optional<Presenca> findByAlunoAndTurma(Aluno aluno, Turma turma);
}
