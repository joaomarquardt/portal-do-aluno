package com.portal_do_aluno.repositories;

import com.portal_do_aluno.domain.Comunicado;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ComunicadoRepository extends JpaRepository<Comunicado, Long> {
}
