package com.portal_do_aluno.services;

import com.portal_do_aluno.domain.Curso;
import com.portal_do_aluno.dtos.CursoDTO;
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

    public List<CursoDTO> findAll() {
        return mapper.toDTOList(repository.findAll());
    }

    public CursoDTO findById(Long id) {
        Curso entidade = repository.findById(id).orElseThrow(() -> new EntityNotFoundException("Curso não encontrado!"));
        return mapper.toDTO(entidade);
    }

    public CursoDTO create(CursoDTO alunoDTO) {
        Curso entidadeCriada = repository.save(mapper.toEntity(alunoDTO));
        return mapper.toDTO(entidadeCriada);
    }

    public CursoDTO update(Long id, CursoDTO alunoDTO) {
        Curso entidade = repository.findById(id).orElseThrow(() -> new EntityNotFoundException("Curso não encontrado!"));
        mapper.updateEntityFromDTO(alunoDTO, entidade);
        entidade = repository.save(entidade);
        return mapper.toDTO(entidade);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
