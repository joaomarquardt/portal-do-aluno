package com.portal_do_aluno.services;

import com.portal_do_aluno.domain.Disciplina;
import com.portal_do_aluno.domain.Professor;
import com.portal_do_aluno.domain.Turma;
import com.portal_do_aluno.dtos.requests.CreateTurmaRequestDTO;
import com.portal_do_aluno.dtos.requests.UpdateTurmaRequestDTO;
import com.portal_do_aluno.dtos.responses.TurmaResponseDTO;
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

    @Autowired
    private DisciplinaService disciplinaService;

    @Autowired
    private ProfessorService professorService;

    @Autowired
    private PeriodoLetivoService periodoLetivoService;

    public List<TurmaResponseDTO> findAll() {
        return mapper.toDTOResponseList(repository.findAll());
    }

    public TurmaResponseDTO findById(Long id) {
        Turma entidade = repository.findById(id).orElseThrow(() -> new EntityNotFoundException("Turma não encontrado!"));
        return mapper.toResponseDTO(entidade);
    }

    public TurmaResponseDTO create(CreateTurmaRequestDTO turmaDTO) {
        Turma entidade = mapper.toEntity(turmaDTO);
        Disciplina disciplina = disciplinaService.findByIdOrThrowEntity(turmaDTO.disciplinaID());
        Professor professor = professorService.findByIdOrThrowEntity(turmaDTO.professorID());
        entidade.setProfessor(professor);
        entidade.setDisciplina(disciplina);
        String periodoLetivo = periodoLetivoService.getAcademicTerm();
        entidade.setPeriodo(periodoLetivo);
        entidade.setCodigo(generateCode(disciplina.getCodigo(), periodoLetivo));
        Turma entidadeCriada = repository.save(entidade);
        return mapper.toResponseDTO(entidadeCriada);
    }

    public TurmaResponseDTO update(Long id, UpdateTurmaRequestDTO turmaDTO) {
        Turma entidade = repository.findById(id).orElseThrow(() -> new EntityNotFoundException("Turma não encontrado!"));
        mapper.updateEntityFromDTO(turmaDTO, entidade);
        entidade = repository.save(entidade);
        return mapper.toResponseDTO(entidade);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public String generateCode(String codigoDisciplina, String periodoLetivo) {
        String prefixo = periodoLetivo + "-" + codigoDisciplina;
        int qtdTurmas = repository.countByCodigoStartingWith(prefixo);
        char letraTurma = (char) ('A' + qtdTurmas);
        return prefixo + '-' + letraTurma;
    }
}
