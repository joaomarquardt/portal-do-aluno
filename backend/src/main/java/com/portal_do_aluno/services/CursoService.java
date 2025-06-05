package com.portal_do_aluno.services;

import com.portal_do_aluno.domain.Curso;
import com.portal_do_aluno.dtos.requests.CreateCursoRequestDTO;
import com.portal_do_aluno.dtos.requests.UpdateCursoRequestDTO;
import com.portal_do_aluno.dtos.responses.CursoResponseDTO;
import com.portal_do_aluno.mappers.CursoMapper;
import com.portal_do_aluno.repositories.CursoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CursoService {
    @Autowired
    private CursoRepository repository;

    @Autowired
    private CursoMapper mapper;

    public List<CursoResponseDTO> findAll() {
        return mapper.toDTOResponseList(repository.findAll());
    }

    public CursoResponseDTO findById(Long id) {
        Curso entidade = findByIdOrThrowEntity(id);
        return mapper.toResponseDTO(entidade);
    }

    public Curso findByIdOrThrowEntity(Long id) {
        return repository.findById(id).orElseThrow(() -> new EntityNotFoundException("Curso não encontrado!"));
    }

    public CursoResponseDTO create(CreateCursoRequestDTO alunoDTO) {
        Curso entidadeCriada = repository.save(mapper.toEntity(alunoDTO));
        return mapper.toResponseDTO(entidadeCriada);
    }

    public CursoResponseDTO update(Long id, UpdateCursoRequestDTO alunoDTO) {
        Curso entidade = repository.findById(id).orElseThrow(() -> new EntityNotFoundException("Curso não encontrado!"));
        mapper.updateEntityFromDTO(alunoDTO, entidade);
        entidade = repository.save(entidade);
        return mapper.toResponseDTO(entidade);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
