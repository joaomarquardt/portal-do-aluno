package com.portal_do_aluno.services;

import com.portal_do_aluno.domain.Aluno;
import com.portal_do_aluno.dtos.AlunoDTO;
import com.portal_do_aluno.mappers.AlunoMapper;
import com.portal_do_aluno.repositories.AlunoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AlunoService {
    @Autowired
    private AlunoRepository repository;

    @Autowired
    private AlunoMapper mapper;

    public List<AlunoDTO> findAll() {
        return mapper.toDTOList(repository.findAll());
    }

    public AlunoDTO findById(Long id) {
        Aluno entidade = repository.findById(id).orElseThrow(() -> new EntityNotFoundException("Aluno não encontrado!"));
        return mapper.toDTO(entidade);
    }

    public AlunoDTO create(AlunoDTO alunoDTO) {
        Aluno entidadeCriada = repository.save(mapper.toEntity(alunoDTO));
        return mapper.toDTO(entidadeCriada);
    }

    public AlunoDTO update(Long id, AlunoDTO alunoDTO) {
        Aluno entidade = repository.findById(id).orElseThrow(() -> new EntityNotFoundException("Aluno não encontrado!"));
        mapper.updateEntityFromDTO(alunoDTO, entidade);
        entidade = repository.save(entidade);
        return mapper.toDTO(entidade);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
