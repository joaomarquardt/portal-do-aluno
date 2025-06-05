package com.portal_do_aluno.services;

import com.portal_do_aluno.domain.Comunicado;
import com.portal_do_aluno.dtos.requests.CreateComunicadoRequestDTO;
import com.portal_do_aluno.dtos.requests.UpdateComunicadoRequestDTO;
import com.portal_do_aluno.dtos.responses.ComunicadoResponseDTO;
import com.portal_do_aluno.mappers.ComunicadoMapper;
import com.portal_do_aluno.repositories.ComunicadoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ComunicadoService {
    @Autowired
    private ComunicadoRepository repository;

    @Autowired
    private ComunicadoMapper mapper;

    public List<ComunicadoResponseDTO> findAll() {
        return mapper.toDTOResponseList(repository.findAll());
    }

    public ComunicadoResponseDTO findById(Long id) {
        Comunicado entidade = repository.findById(id).orElseThrow(() -> new EntityNotFoundException("Comunicado não encontrado!"));
        return mapper.toResponseDTO(entidade);
    }

    public  ComunicadoResponseDTO create(CreateComunicadoRequestDTO comunicadoDTO) {
        Comunicado entidadeCriada = repository.save(mapper.toEntity(comunicadoDTO));
        return mapper.toResponseDTO(entidadeCriada);
    }

    public ComunicadoResponseDTO update(Long id, UpdateComunicadoRequestDTO comunicadoDTO) {
        Comunicado entidade = repository.findById(id).orElseThrow(() -> new EntityNotFoundException("Comunicado não encontrado!"));
        mapper.updateEntityFromDTO(comunicadoDTO, entidade);
        entidade = repository.save(entidade);
        return mapper.toResponseDTO(entidade);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
