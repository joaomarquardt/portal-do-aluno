package com.portal_do_aluno.services;

import com.portal_do_aluno.domain.Turma;
import com.portal_do_aluno.dtos.TurmaDTO;
import com.portal_do_aluno.mappers.TurmaMapper;
import com.portal_do_aluno.repositories.TurmaRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TurmaService {
    @Autowired
    private TurmaRepository repository;

    @Autowired
    private TurmaMapper mapper;

    public List<TurmaDTO> findAll() {
        return mapper.toDTOList(repository.findAll());
    }

    public TurmaDTO findById(Long id) {
        Turma entidade = repository.findById(id).orElseThrow(() -> new EntityNotFoundException("Turma não encontrado!"));
        return mapper.toDTO(entidade);
    }

    public TurmaDTO create(TurmaDTO turmaDTO) {
        Turma entidadeCriada = repository.save(mapper.toEntity(turmaDTO));
        return mapper.toDTO(entidadeCriada);
    }

    public TurmaDTO update(Long id, TurmaDTO turmaDTO) {
        Turma entidade = repository.findById(id).orElseThrow(() -> new EntityNotFoundException("Turma não encontrado!"));
        mapper.updateEntityFromDTO(turmaDTO, entidade);
        entidade = repository.save(entidade);
        return mapper.toDTO(entidade);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
