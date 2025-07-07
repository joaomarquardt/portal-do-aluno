package com.portal_do_aluno.services;

import com.portal_do_aluno.domain.PeriodoLetivo;
import com.portal_do_aluno.dtos.requests.CreatePeriodoLetivoRequestDTO;
import com.portal_do_aluno.dtos.requests.UpdatePeriodoLetivoRequestDTO;
import com.portal_do_aluno.dtos.responses.PeriodoLetivoResponseDTO;
import com.portal_do_aluno.exceptions.GlobalExceptionHandler;
import com.portal_do_aluno.mappers.PeriodoLetivoMapper;
import com.portal_do_aluno.repositories.PeriodoLetivoRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

import static org.springframework.data.jpa.domain.AbstractPersistable_.id;

@Service
public class PeriodoLetivoService {
    @Autowired
    private PeriodoLetivoRepository repository;

    @Autowired
    private PeriodoLetivoMapper mapper;

    @Autowired
    private TurmaService turmaService;

    @Autowired
    private PeriodoLetivoProvider provider;

    public List<PeriodoLetivoResponseDTO> findAll() {
        return mapper.toDTOList(repository.findAll());
    }

    public PeriodoLetivoResponseDTO findById(Long id) {
        PeriodoLetivo entidade = repository.findById(id).orElseThrow(() -> new EntityNotFoundException("Periodo Letivo não encontrado!"));
        return mapper.toResponseDTO(entidade);
    }

    @Transactional
    public PeriodoLetivoResponseDTO create(CreatePeriodoLetivoRequestDTO periodoLetivoDTO) {
        if (!periodoLetivoDTO.dataFim().isAfter(periodoLetivoDTO.dataInicio())) {
            throw new InvalidDateRangeException("Data de início não pode ser posterior/igual a data de fim!");
        }
        PeriodoLetivo periodoLetivoAtivo;
        if (!repository.findAll().isEmpty()) {
            periodoLetivoAtivo = repository.findByAtivoTrue().orElseThrow(() -> new EntityNotFoundException("Não foi encontrado nenhum período letivo ativo!"));
            if (periodoLetivoDTO.ativo() && !periodoLetivoAtivo.getDataFim().isBefore(periodoLetivoDTO.dataInicio())) {
                throw new InvalidDateRangeException("Data de início do novo período não pode ser anterior a data de fim do último período!");
            }
            if (periodoLetivoDTO.ativo()) {
                repository.deactivateAllActive();
            }
        }
        PeriodoLetivo entidadeCriada = repository.save(mapper.toEntity(periodoLetivoDTO));
        return mapper.toResponseDTO(entidadeCriada);
    }

    public PeriodoLetivoResponseDTO update(Long id, UpdatePeriodoLetivoRequestDTO periodoLetivoDTO) {
        PeriodoLetivo entidade = repository.findById(id).orElseThrow(() -> new EntityNotFoundException("Periodo Letivo não encontrado!"));
        PeriodoLetivo periodoLetivoAtivo = repository.findByAtivoTrue().orElseThrow(() -> new EntityNotFoundException("Não foi encontrado nenhum período letivo ativo!"));
        if (periodoLetivoDTO.ativo() && !Objects.equals(periodoLetivoAtivo.getId(), id) && !periodoLetivoAtivo.getDataFim().isBefore(periodoLetivoDTO.dataFim())) {
            throw new InvalidDateRangeException("Data de fim do novo período ativo não pode ser anterior a data de fim do período ativo antigo!");
        }
        if (entidade.isAtivo() && !periodoLetivoDTO.ativo()) {
            turmaService.updateStatusToClosed(provider.getAcademicTerm());
        }
        mapper.updateEntityFromDTO(periodoLetivoDTO, entidade);
        entidade = repository.save(entidade);
        return mapper.toResponseDTO(entidade);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }


}
