package com.portal_do_aluno.services;

import com.portal_do_aluno.domain.Presenca;
import com.portal_do_aluno.dtos.PresencaDTO;
import com.portal_do_aluno.mappers.PresencaMapper;
import com.portal_do_aluno.repositories.PresencaRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PresencaService {
    @Autowired
    private PresencaRepository repository;

    @Autowired
    private PresencaMapper mapper;

    public List<PresencaDTO> findAll() {
        return mapper.toDTOList(repository.findAll());
    }

    public PresencaDTO findById(Long id) {
        Presenca entidade = repository.findById(id).orElseThrow(() -> new EntityNotFoundException("Presenca não encontrado!"));
        return mapper.toDTO(entidade);
    }

    public PresencaDTO create(PresencaDTO presencaDTO) {
        Presenca entidadeCriada = repository.save(mapper.toEntity(presencaDTO));
        return mapper.toDTO(entidadeCriada);
    }

    public PresencaDTO update(Long id, PresencaDTO presencaDTO) {
        Presenca entidade = repository.findById(id).orElseThrow(() -> new EntityNotFoundException("Presenca não encontrado!"));
        mapper.updateEntityFromDTO(presencaDTO, entidade);
        entidade = repository.save(entidade);
        return mapper.toDTO(entidade);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
