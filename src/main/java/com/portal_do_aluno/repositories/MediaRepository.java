package com.portal_do_aluno.repositories;

import com.portal_do_aluno.domain.Media;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MediaRepository extends JpaRepository<Media, Long> {
}
