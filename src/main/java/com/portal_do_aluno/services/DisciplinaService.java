package com.portal_do_aluno.services;

import com.portal_do_aluno.domain.Disciplina;
import com.portal_do_aluno.dtos.DisciplinaDTO;
import com.portal_do_aluno.mappers.DisciplinaMapper;
import com.portal_do_aluno.repositories.DisciplinaRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DisciplinaService {
    @Autowired
    private DisciplinaRepository repository;

    @Autowired
    private DisciplinaMapper mapper;

    public List<DisciplinaDTO> findAll() {
        return mapper.toDTOList(repository.findAll());
    }

    public DisciplinaDTO findById(Long id) {
        Disciplina entidade = repository.findById(id).orElseThrow(() -> new EntityNotFoundException("Disciplina não encontrado!"));
        return mapper.toDTO(entidade);
    }

    public DisciplinaDTO create(DisciplinaDTO alunoDTO) {
        Disciplina entidadeCriada = repository.save(mapper.toEntity(alunoDTO));
        return mapper.toDTO(entidadeCriada);
    }

    public DisciplinaDTO update(Long id, DisciplinaDTO alunoDTO) {
        Disciplina entidade = repository.findById(id).orElseThrow(() -> new EntityNotFoundException("Disciplina não encontrado!"));
        mapper.updateEntityFromDTO(alunoDTO, entidade);
        entidade = repository.save(entidade);
        return mapper.toDTO(entidade);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
