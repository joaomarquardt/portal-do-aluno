package com.portal_do_aluno.repositories;

import com.portal_do_aluno.domain.Aluno;
import com.portal_do_aluno.domain.Media;
import com.portal_do_aluno.domain.Turma;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MediaRepository extends JpaRepository<Media, Long> {
    Optional<Media> findByAlunoAndTurma(Aluno aluno, Turma turma);
}
