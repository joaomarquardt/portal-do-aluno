package com.portal_do_aluno.mappers;

import com.portal_do_aluno.domain.Media;
import com.portal_do_aluno.dtos.MediaDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface MediaMapper {
    MediaMapper INSTANCE = Mappers.getMapper(MediaMapper.class);

    MediaDTO toDTO(Media entity);

    Media toEntity(MediaDTO dto);

    List<MediaDTO> toDTOList(List<Media> entities);

    List<Media> toEntityList(List<MediaDTO> dtos);

    @Mapping(target = "id", ignore = true)
    void updateEntityFromDTO(MediaDTO dto, @MappingTarget Media entity);
}
