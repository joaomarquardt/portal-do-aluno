package com.portal_do_aluno.services;

import com.portal_do_aluno.domain.Professor;
import com.portal_do_aluno.dtos.ProfessorDTO;
import com.portal_do_aluno.mappers.ProfessorMapper;
import com.portal_do_aluno.repositories.ProfessorRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProfessorService {
    @Autowired
    private ProfessorRepository repository;

    @Autowired
    private ProfessorMapper mapper;

    public List<ProfessorDTO> findAll() {
        return mapper.toDTOList(repository.findAll());
    }

    public ProfessorDTO findById(Long id) {
        Professor entidade = repository.findById(id).orElseThrow(() -> new EntityNotFoundException("Professor não encontrado!"));
        return mapper.toDTO(entidade);
    }

    public ProfessorDTO create(ProfessorDTO professorDTO) {
        Professor entidadeCriada = repository.save(mapper.toEntity(professorDTO));
        return mapper.toDTO(entidadeCriada);
    }

    public ProfessorDTO update(Long id, ProfessorDTO professorDTO) {
        Professor entidade = repository.findById(id).orElseThrow(() -> new EntityNotFoundException("Professor não encontrado!"));
        mapper.updateEntityFromDTO(professorDTO, entidade);
        entidade = repository.save(entidade);
        return mapper.toDTO(entidade);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
