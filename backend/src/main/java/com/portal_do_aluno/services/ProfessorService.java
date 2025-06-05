package com.portal_do_aluno.services;

import com.portal_do_aluno.domain.Professor;
import com.portal_do_aluno.dtos.requests.CreateProfessorRequestDTO;
import com.portal_do_aluno.dtos.requests.UpdateProfessorRequestDTO;
import com.portal_do_aluno.dtos.responses.ProfessorResponseDTO;
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

    public List<ProfessorResponseDTO> findAll() {
        return mapper.toDTOResponseList(repository.findAll());
    }

    public ProfessorResponseDTO findById(Long id) {
        Professor entidade = repository.findById(id).orElseThrow(() -> new EntityNotFoundException("Professor não encontrado!"));
        return mapper.toResponseDTO(entidade);
    }

    public Professor findBySiapeOrThrowEntity(String siape) {
        return repository.findBySiape(siape).orElseThrow(() -> new EntityNotFoundException("Professor não encontrado!"));
    }

    public ProfessorResponseDTO create(CreateProfessorRequestDTO professorDTO) {
        Professor entidadeCriada = repository.save(mapper.toEntity(professorDTO));
        return mapper.toResponseDTO(entidadeCriada);
    }

    public ProfessorResponseDTO update(Long id, UpdateProfessorRequestDTO professorDTO) {
        Professor entidade = repository.findById(id).orElseThrow(() -> new EntityNotFoundException("Professor não encontrado!"));
        mapper.updateEntityFromDTO(professorDTO, entidade);
        entidade = repository.save(entidade);
        return mapper.toResponseDTO(entidade);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
