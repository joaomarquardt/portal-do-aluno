package com.portal_do_aluno.services;

import com.portal_do_aluno.domain.Usuario;
import com.portal_do_aluno.dtos.UsuarioDTO;
import com.portal_do_aluno.mappers.UsuarioMapper;
import com.portal_do_aluno.repositories.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {
    @Autowired
    private UsuarioRepository repository;

    @Autowired
    private UsuarioMapper mapper;

    public List<UsuarioDTO> findAll() {
        return mapper.toDTOList(repository.findAll());
    }

    public UsuarioDTO findById(Long id) {
        Usuario entidade = repository.findById(id).orElseThrow(() -> new EntityNotFoundException("Usuario não encontrado!"));
        return mapper.toDTO(entidade);
    }

    public UsuarioDTO create(UsuarioDTO usuarioDTO) {
        Usuario entidadeCriada = repository.save(mapper.toEntity(usuarioDTO));
        return mapper.toDTO(entidadeCriada);
    }

    public UsuarioDTO update(Long id, UsuarioDTO usuarioDTO) {
        Usuario entidade = repository.findById(id).orElseThrow(() -> new EntityNotFoundException("Usuario não encontrado!"));
        mapper.updateEntityFromDTO(usuarioDTO, entidade);
        entidade = repository.save(entidade);
        return mapper.toDTO(entidade);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
