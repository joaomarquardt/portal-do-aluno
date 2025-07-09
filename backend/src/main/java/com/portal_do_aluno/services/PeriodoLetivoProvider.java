package com.portal_do_aluno.services;

import com.portal_do_aluno.domain.PeriodoLetivo;
import com.portal_do_aluno.repositories.PeriodoLetivoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PeriodoLetivoProvider {
    @Autowired
    private PeriodoLetivoRepository repository;

    public String getAcademicTerm() {
        PeriodoLetivo entidade = repository.findByAtivoTrue().orElseThrow(() -> new EntityNotFoundException("Não foi encontrado nenhum período letivo ativo!"));
        return Integer.toString(entidade.getAno()) + "." + Integer.toString(entidade.getSemestre());
    }
}
