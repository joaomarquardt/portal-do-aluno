package com.portal_do_aluno.services;

import com.portal_do_aluno.domain.Aluno;
import com.portal_do_aluno.domain.Professor;
import com.portal_do_aluno.domain.Usuario;
import com.portal_do_aluno.dtos.requests.UpdateUsuarioRequestDTO;
import com.portal_do_aluno.dtos.responses.AlunoResponseDTO;
import com.portal_do_aluno.dtos.responses.ProfessorResponseDTO;
import com.portal_do_aluno.dtos.responses.UsuarioResponseDTO;
import com.portal_do_aluno.mappers.AlunoMapper;
import com.portal_do_aluno.mappers.ProfessorMapper;
import com.portal_do_aluno.mappers.UsuarioMapper;
import com.portal_do_aluno.repositories.UsuarioRepository;
import com.portal_do_aluno.security.dtos.requests.RegisterRequestDTO;
import com.portal_do_aluno.security.exceptions.RegisterConflictException;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {
    @Autowired
    private UsuarioRepository repository;

    @Autowired
    private AlunoService alunoService;

    @Autowired
    private UsuarioMapper mapper;

    @Autowired
    private AlunoMapper alunoMapper;

    @Autowired
    private ProfessorService professorService;

    @Autowired
    private ProfessorMapper professorMapper;

    public List<UsuarioResponseDTO> findAll() {
        return mapper.toDTOResponseList(repository.findAll());
    }

    public UsuarioResponseDTO findById(Long id) {
        Usuario entidade = repository.findById(id).orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado!"));
        return mapper.toResponseDTO(entidade);
    }

    public UsuarioResponseDTO create(RegisterRequestDTO usuarioDTO) {
        if (repository.findByCpf(usuarioDTO.cpf()).isPresent()) {
            throw new RegisterConflictException("CPF já vinculado a usuário.");
        }
        if (repository.findByEmailInstitucional(usuarioDTO.emailInstitucional()).isPresent()) {
            throw new RegisterConflictException("Email institucional já vinculado a usuário.");
        }
        Usuario entidade = mapper.toEntity(usuarioDTO);
        if (usuarioDTO.aluno() != null) {
            AlunoResponseDTO alunoCriado = alunoService.create(usuarioDTO.aluno());
            Aluno aluno = alunoService.findByMatriculaOrThrowEntity(alunoCriado.matricula());
            entidade.setAluno(aluno);
            entidade.getAluno().setUsuario(entidade);
        }
        if (usuarioDTO.professor() != null) {
            ProfessorResponseDTO professorCriado = professorService.create(usuarioDTO.professor());
            Professor professor = professorService.findBySiapeOrThrowEntity(professorCriado.siape());
            entidade.setProfessor(professor);
            entidade.getProfessor().setUsuario(entidade);
        }
        Usuario entidadeCriada = repository.save(entidade);
        return mapper.toResponseDTO(entidadeCriada);
    }

    public UsuarioResponseDTO update(Long id, UpdateUsuarioRequestDTO usuarioDTO) {
        Usuario entidade = repository.findById(id).orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado!"));
        mapper.updateEntityFromDTO(usuarioDTO, entidade);
        entidade = repository.save(entidade);
        return mapper.toResponseDTO(entidade);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    private Usuario getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (Usuario) authentication.getPrincipal();
    }
}
