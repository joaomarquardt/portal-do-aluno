package com.portal_do_aluno.services;

import com.portal_do_aluno.domain.Comunicado;
import com.portal_do_aluno.dtos.ComunicadoDTO;
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

    public List<ComunicadoDTO> findAll() {
        return mapper.toDTOList(repository.findAll());
    }

    public ComunicadoDTO findById(Long id) {
        Comunicado entidade = repository.findById(id).orElseThrow(() -> new EntityNotFoundException("Comunicado não encontrado!"));
        return mapper.toDTO(entidade);
    }

    public ComunicadoDTO create(ComunicadoDTO alunoDTO) {
        Comunicado entidadeCriada = repository.save(mapper.toEntity(alunoDTO));
        return mapper.toDTO(entidadeCriada);
    }

    public ComunicadoDTO update(Long id, ComunicadoDTO alunoDTO) {
        Comunicado entidade = repository.findById(id).orElseThrow(() -> new EntityNotFoundException("Comunicado não encontrado!"));
        mapper.updateEntityFromDTO(alunoDTO, entidade);
        entidade = repository.save(entidade);
        return mapper.toDTO(entidade);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
