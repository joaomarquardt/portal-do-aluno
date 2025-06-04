package com.portal_do_aluno.services;

import com.portal_do_aluno.domain.*;
import com.portal_do_aluno.dtos.requests.CreateAlunoRequestDTO;
import com.portal_do_aluno.dtos.requests.UpdateAlunoRequestDTO;
import com.portal_do_aluno.dtos.responses.AlunoResponseDTO;
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

    public List<AlunoResponseDTO> findAll() {
        return mapper.toDTOResponseList(alunoRepository.findAll());
    }

    public AlunoResponseDTO findById(Long id) {
        Aluno entidade = findByIdOrThrowEntity(id);
        return mapper.toResponseDTO(entidade);
    }

    public Aluno findByIdOrThrowEntity(Long id) {
        return alunoRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Aluno não encontrado!"));
    }

    public Aluno findByMatriculaOrThrowEntity(String matricula) {
        return alunoRepository.findByMatricula(matricula).orElseThrow(() -> new EntityNotFoundException("Aluno não encontrado!"));
    }

    public AlunoResponseDTO create(CreateAlunoRequestDTO alunoDTO) {
        Aluno entidadeCriada = alunoRepository.save(mapper.toEntity(alunoDTO));
        return mapper.toResponseDTO(entidadeCriada);
    }

    public AlunoResponseDTO update(Long id, UpdateAlunoRequestDTO alunoDTO) {
        Aluno entidade = alunoRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Aluno não encontrado!"));
        mapper.updateEntityFromDTO(alunoDTO, entidade);
        entidade = alunoRepository.save(entidade);
        return mapper.toResponseDTO(entidade);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
