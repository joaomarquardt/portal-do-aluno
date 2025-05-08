package com.portal_do_aluno.mappers;

import com.portal_do_aluno.domain.Comunicado;
import com.portal_do_aluno.dtos.ComunicadoDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ComunicadoMapper {
    ComunicadoMapper INSTANCE = Mappers.getMapper(ComunicadoMapper.class);

    ComunicadoDTO toDTO(Comunicado entity);

    Comunicado toEntity(ComunicadoDTO dto);

    List<ComunicadoDTO> toDTOList(List<Comunicado> entities);

    List<Comunicado> toEntityList(List<ComunicadoDTO> dtos);

    @Mapping(target = "id", ignore = true)
    void updateEntityFromDTO(ComunicadoDTO dto, @MappingTarget Comunicado entity);
}
