package com.portal_do_aluno.services;

import com.portal_do_aluno.domain.PeriodoLetivo;
import com.portal_do_aluno.dtos.requests.CreatePeriodoLetivoRequestDTO;
import com.portal_do_aluno.dtos.requests.UpdatePeriodoLetivoRequestDTO;
import com.portal_do_aluno.dtos.responses.PeriodoLetivoResponseDTO;
import com.portal_do_aluno.exceptions.InvalidDateRangeException;
import com.portal_do_aluno.mappers.PeriodoLetivoMapper;
import com.portal_do_aluno.repositories.PeriodoLetivoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class PeriodoLetivoService {
    @Autowired
    private PeriodoLetivoRepository repository;

    @Autowired
    private PeriodoLetivoMapper mapper;

    public List<PeriodoLetivoResponseDTO> findAll() {
        return mapper.toDTOList(repository.findAll());
    }

    public PeriodoLetivoResponseDTO findById(Long id) {
        PeriodoLetivo entidade = repository.findById(id).orElseThrow(() -> new EntityNotFoundException("Periodo Letivo não encontrado!"));
        return mapper.toResponseDTO(entidade);
    }

    public PeriodoLetivoResponseDTO create(CreatePeriodoLetivoRequestDTO periodoLetivoDTO) {
        if (!periodoLetivoDTO.dataFim().isAfter(periodoLetivoDTO.dataInicio())) {
            throw new InvalidDateRangeException("Data de início não pode ser maior/igual a data de fim!");
        }
        PeriodoLetivo entidadeCriada = repository.save(mapper.toEntity(periodoLetivoDTO));
        return mapper.toResponseDTO(entidadeCriada);
    }

    public PeriodoLetivoResponseDTO update(Long id, UpdatePeriodoLetivoRequestDTO periodoLetivoDTO) {
        PeriodoLetivo entidade = repository.findById(id).orElseThrow(() -> new EntityNotFoundException("Periodo Letivo não encontrado!"));
        mapper.updateEntityFromDTO(periodoLetivoDTO, entidade);
        entidade = repository.save(entidade);
        return mapper.toResponseDTO(entidade);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public String getAcademicTerm() {
        PeriodoLetivo entidade = repository.findByAtivoTrue().orElseThrow(() -> new EntityNotFoundException("Não foi encontrado nenhum período letivo ativo!"));
        return Integer.toString(entidade.getAno()) + "." + Integer.toString(entidade.getSemestre());
    }
}
