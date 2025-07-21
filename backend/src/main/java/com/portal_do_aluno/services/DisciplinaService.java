package com.portal_do_aluno.services;

import com.portal_do_aluno.domain.Disciplina;
import com.portal_do_aluno.dtos.requests.CreateDisciplinaRequestDTO;
import com.portal_do_aluno.dtos.requests.UpdateDisciplinaRequestDTO;
import com.portal_do_aluno.dtos.responses.DisciplinaResponseDTO;
import com.portal_do_aluno.mappers.DisciplinaMapper;
import com.portal_do_aluno.repositories.DisciplinaRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DisciplinaService {
    @Autowired
    private DisciplinaRepository repository;

    @Autowired
    private CursoService cursoService;

    @Qualifier("disciplinaMapperImpl")
    @Autowired
    private DisciplinaMapper mapper;

    public List<DisciplinaResponseDTO> findAll() {
        return mapper.toDTOResponseList(repository.findAll());
    }

    public DisciplinaResponseDTO findById(Long id) {
        Disciplina entidade = findByIdOrThrowEntity(id);
        return mapper.toResponseDTO(entidade);
    }

    public Disciplina findByIdOrThrowEntity(Long id) {
        return repository.findById(id).orElseThrow(() -> new EntityNotFoundException("Disciplina não encontrada!"));
    }

    public DisciplinaResponseDTO create(CreateDisciplinaRequestDTO disciplinaDTO) {
        Disciplina entidade = mapper.toEntity(disciplinaDTO);
        entidade.setCurso(cursoService.findByIdOrThrowEntity(disciplinaDTO.cursoID()));
        Disciplina entidadeCriada = repository.save(entidade);
        return mapper.toResponseDTO(entidadeCriada);
    }

    public DisciplinaResponseDTO update(Long id, UpdateDisciplinaRequestDTO disciplinaDTO) {
        Disciplina entidade = repository.findById(id).orElseThrow(() -> new EntityNotFoundException("Disciplina não encontrado!"));
        mapper.updateEntityFromDTO(disciplinaDTO, entidade);
        entidade = repository.save(entidade);
        return mapper.toResponseDTO(entidade);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
