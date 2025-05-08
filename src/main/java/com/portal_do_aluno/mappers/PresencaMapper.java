package com.portal_do_aluno.mappers;

import com.portal_do_aluno.domain.Presenca;
import com.portal_do_aluno.dtos.PresencaDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PresencaMapper {
    PresencaMapper INSTANCE = Mappers.getMapper(PresencaMapper.class);

    PresencaDTO toDTO(Presenca entity);

    Presenca toEntity(PresencaDTO dto);

    List<PresencaDTO> toDTOList(List<Presenca> entities);

    List<Presenca> toEntityList(List<PresencaDTO> dtos);

    @Mapping(target = "id", ignore = true)
    void updateEntityFromDTO(PresencaDTO dto, @MappingTarget Presenca entity);
}
