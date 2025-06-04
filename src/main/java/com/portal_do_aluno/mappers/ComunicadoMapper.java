package com.portal_do_aluno.mappers;

import com.portal_do_aluno.domain.Comunicado;
import com.portal_do_aluno.dtos.requests.CreateComunicadoRequestDTO;
import com.portal_do_aluno.dtos.requests.UpdateComunicadoRequestDTO;
import com.portal_do_aluno.dtos.responses.ComunicadoResponseDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ComunicadoMapper {
    ComunicadoMapper INSTANCE = Mappers.getMapper(ComunicadoMapper.class);

    ComunicadoResponseDTO toResponseDTO(Comunicado entity);

    Comunicado toEntity(CreateComunicadoRequestDTO dto);

    List<ComunicadoResponseDTO> toDTOResponseList(List<Comunicado> entities);

    @Mapping(target = "id", ignore = true)
    void updateEntityFromDTO(UpdateComunicadoRequestDTO dto, @MappingTarget Comunicado entity);
}
