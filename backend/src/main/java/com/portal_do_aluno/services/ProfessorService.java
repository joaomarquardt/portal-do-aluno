package com.portal_do_aluno.services;

import com.portal_do_aluno.domain.Media;
import com.portal_do_aluno.domain.Professor;
import com.portal_do_aluno.domain.Turma;
import com.portal_do_aluno.domain.TurmaStatus;
import com.portal_do_aluno.dtos.requests.CreateProfessorRequestDTO;
import com.portal_do_aluno.dtos.requests.UpdateProfessorRequestDTO;
import com.portal_do_aluno.dtos.responses.*;
import com.portal_do_aluno.mappers.ProfessorMapper;
import com.portal_do_aluno.repositories.MediaRepository;
import com.portal_do_aluno.repositories.ProfessorRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProfessorService {
    @Autowired
    private ProfessorRepository repository;

    @Autowired
    private MediaRepository mediaRepository;

    @Qualifier("professorMapperImpl")
    @Autowired
    private ProfessorMapper mapper;

    public List<ProfessorResponseDTO> findAll() {
        return mapper.toDTOResponseList(repository.findAll());
    }

    public ProfessorResponseDTO findById(Long id) {
        Professor entidade = findByIdOrThrowEntity(id);
        return mapper.toResponseDTO(entidade);
    }

    public Professor findByIdOrThrowEntity(Long id) {
        return repository.findById(id).orElseThrow(() -> new EntityNotFoundException("Professor não encontrado!"));
    }

    public Professor findBySiapeOrThrowEntity(String siape) {
        return repository.findBySiape(siape).orElseThrow(() -> new EntityNotFoundException("Professor não encontrado!"));
    }

    public List<ProfessorResponseDTO> listAllToSelect() {
        return mapper.toDTOResponseList(repository.findAll());
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

    public DashboardProfessorResponseDTO getProfessorDashboardSummary(Long idProfessor) {
        Professor professor = findByIdOrThrowEntity(idProfessor);
        List<Turma> turmas = professor.getTurmas();
        Integer numTurmasAtivas = turmas.stream()
                .filter(turma -> turma.getStatus() == TurmaStatus.ATIVA).toList()
                .size();
        Long totalAlunosGerenciados = turmas.stream()
                .filter(turma -> turma.getStatus() == TurmaStatus.ATIVA)
                .mapToLong(turma -> turma.getAlunos().size())
                .sum();
        List<Long> idsTurmas = turmas.stream()
                .map(Turma::getId)
                .toList();
        List<Media> medias = mediaRepository.findByTurmaIdIn(idsTurmas);
        Double mediaAlunosGerenciados = medias.stream()
                .filter(m -> m.getValor() != null)
                .mapToDouble(Media::getValor)
                .average()
                .orElse(0.0);
        return new DashboardProfessorResponseDTO(numTurmasAtivas, totalAlunosGerenciados, mediaAlunosGerenciados);
    }

    public List<TurmaDesempenhoResponseDTO> getActiveClassesByProfessor(Long id) {
        Professor professor = findByIdOrThrowEntity(id);
        return professor.getTurmas().stream()
                .filter(turma -> turma.getStatus() == TurmaStatus.ATIVA)
                .map(turma -> {
                        Long idTurma = turma.getId();
                        TurmaStatus status = turma.getStatus();
                        String codigoTurma = turma.getCodigo();
                        String nomeDisciplina = turma.getDisciplina().getNome();
                        String periodo = turma.getPeriodo();
                        String horario = turma.getHorario();
                        String nomeProfessor = turma.getProfessor().getUsuario().getNome();
                        Integer cargaHoraria = turma.getDisciplina().getCargaHoraria();
                        return new TurmaDesempenhoResponseDTO(idTurma, status, codigoTurma,
                                nomeDisciplina, periodo, horario, nomeProfessor, cargaHoraria);
                }).toList();
    }
}
