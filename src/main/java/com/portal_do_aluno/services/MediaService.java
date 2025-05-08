package com.portal_do_aluno.services;

import com.portal_do_aluno.domain.Media;
import com.portal_do_aluno.dtos.MediaDTO;
import com.portal_do_aluno.mappers.MediaMapper;
import com.portal_do_aluno.repositories.MediaRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MediaService {
    @Autowired
    private MediaRepository repository;

    @Autowired
    private MediaMapper mapper;

    public List<MediaDTO> findAll() {
        return mapper.toDTOList(repository.findAll());
    }

    public MediaDTO findById(Long id) {
        Media entidade = repository.findById(id).orElseThrow(() -> new EntityNotFoundException("Media não encontrado!"));
        return mapper.toDTO(entidade);
    }

    public MediaDTO create(MediaDTO mediaDTO) {
        Media entidadeCriada = repository.save(mapper.toEntity(mediaDTO));
        return mapper.toDTO(entidadeCriada);
    }

    public MediaDTO update(Long id, MediaDTO mediaDTO) {
        Media entidade = repository.findById(id).orElseThrow(() -> new EntityNotFoundException("Media não encontrado!"));
        mapper.updateEntityFromDTO(mediaDTO, entidade);
        entidade = repository.save(entidade);
        return mapper.toDTO(entidade);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
