package com.portal_do_aluno.services;

import com.portal_do_aluno.domain.*;
import com.portal_do_aluno.dtos.requests.CreateAlunoRequestDTO;
import com.portal_do_aluno.dtos.requests.UpdateAlunoRequestDTO;
import com.portal_do_aluno.dtos.responses.AlunoResponseDTO;
import com.portal_do_aluno.dtos.responses.DesempenhoResponseDTO;
import com.portal_do_aluno.dtos.responses.TurmaDesempenhoResponseDTO;
import com.portal_do_aluno.mappers.AlunoMapper;
import com.portal_do_aluno.repositories.AlunoRepository;
import com.portal_do_aluno.repositories.MediaRepository;
import com.portal_do_aluno.repositories.PresencaRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AlunoService {
    @Autowired
    private AlunoRepository alunoRepository;

    @Autowired
    private PeriodoLetivoService periodoLetivoService;

    @Autowired
    private CursoService cursoService;

    @Autowired
    private PresencaRepository presencaRepository;

    @Autowired
    private MediaRepository mediaRepository;

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
        Aluno entidade = mapper.toEntity(alunoDTO);
        entidade.setPeriodoAtual(1);
        String periodoLetivo = periodoLetivoService.getAcademicTerm();
        entidade.setPeriodoIngresso(periodoLetivo);
        entidade.setCurso(cursoService.findByIdOrThrowEntity(alunoDTO.cursoID()));
        entidade.setMatricula(generateRegistration(entidade, periodoLetivo));
        Aluno entidadeCriada = alunoRepository.save(entidade);
        return mapper.toResponseDTO(entidadeCriada);
    }

    public AlunoResponseDTO update(Long id, UpdateAlunoRequestDTO alunoDTO) {
        Aluno entidade = alunoRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Aluno não encontrado!"));
        mapper.updateEntityFromDTO(alunoDTO, entidade);
        entidade = alunoRepository.save(entidade);
        return mapper.toResponseDTO(entidade);
    }

    public void delete(Long id) {
        alunoRepository.deleteById(id);
    }

    public String generateRegistration(Aluno aluno, String periodoLetivo) {
        String anoAtual = periodoLetivo.substring(0, 4);
        String periodoAtual = periodoLetivo.substring(5);
        String codigoCurso = String.format("%03d", aluno.getCurso().getId());
        String posicaoMatricula = String.format("%03d", alunoRepository.countByCursoAndPeriodoIngresso(aluno.getCurso(), aluno.getPeriodoIngresso()) + 1);
        return anoAtual + periodoAtual + codigoCurso + posicaoMatricula;
    }

    public List<DesempenhoResponseDTO> getSchoolPerformance(Long id) {
        Aluno aluno = alunoRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Aluno não encontrado!"));
        return aluno.getTurmas().stream()
                .map(
                        turma -> {
                            Media media = mediaRepository.findByAlunoAndTurma(aluno, turma).orElseThrow(() -> new EntityNotFoundException("Não há média registrada para o aluno nesta turma!"));
                            Presenca presenca = presencaRepository.findByAlunoAndTurma(aluno, turma).orElseThrow(() -> new EntityNotFoundException("Não há presença registrada para o aluno nesta turma!"));
                            TurmaDesempenhoResponseDTO turmaDesempenhoResponseDTO = new TurmaDesempenhoResponseDTO(
                                    turma.getCodigo(),
                                    turma.getDisciplina().getNome(),
                                    turma.getPeriodo()
                            );
                            return new DesempenhoResponseDTO(turmaDesempenhoResponseDTO, media.getValor(), presenca.getNumeroPresencas());
                        }
                )
                .toList();
    }
}
