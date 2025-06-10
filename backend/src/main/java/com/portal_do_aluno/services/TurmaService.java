package com.portal_do_aluno.services;

import com.portal_do_aluno.domain.*;
import com.portal_do_aluno.dtos.requests.CreateTurmaRequestDTO;
import com.portal_do_aluno.dtos.requests.UpdateTurmaRequestDTO;
import com.portal_do_aluno.dtos.responses.TurmaResponseDTO;
import com.portal_do_aluno.exceptions.VagasInsuficientesException;
import com.portal_do_aluno.mappers.TurmaMapper;
import com.portal_do_aluno.repositories.MediaRepository;
import com.portal_do_aluno.repositories.PresencaRepository;
import com.portal_do_aluno.repositories.TurmaRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
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

    @Autowired
    private AlunoService alunoService;

    @Autowired
    private MediaRepository mediaRepository;

    @Autowired
    private PresencaRepository presencaRepository;

    public List<TurmaResponseDTO> findAll() {
        return mapper.toDTOResponseList(repository.findAll());
    }

    public TurmaResponseDTO findById(Long id) {
        Turma entidade = findByIdOrThrowEntity(id);
        return mapper.toResponseDTO(entidade);
    }

    public Turma findByIdOrThrowEntity(Long id) {
        return repository.findById(id).orElseThrow(() -> new EntityNotFoundException("Turma não encontrada!"));
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

    public TurmaResponseDTO addStudentsToTheClass(Long idTurma, List<Long> idAlunos) {
        Turma turma = findByIdOrThrowEntity(idTurma);
        int vagasDisponiveis = turma.getVagasTotais() - turma.getAlunos().size();
        if (vagasDisponiveis < idAlunos.size()) {
            throw new VagasInsuficientesException("Não há vagas suficientes para esta turma!");
        }
        List<Aluno> alunos = new ArrayList<Aluno>();
        for (Long id : idAlunos) {
            Aluno aluno = alunoService.findByIdOrThrowEntity(id);
            if (!turma.getAlunos().contains(aluno)) {
                turma.getAlunos().add(aluno);
                mediaRepository.save(new Media(0.0, aluno, turma));
                presencaRepository.save(new Presenca(0, aluno, turma));
            }
        }
        Turma turmaAtualizada = repository.save(turma);
        return mapper.toResponseDTO(turmaAtualizada);
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
