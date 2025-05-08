package com.portal_do_aluno.mappers;

import com.portal_do_aluno.domain.Curso;
import com.portal_do_aluno.dtos.CursoDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CursoMapper {
    CursoMapper INSTANCE = Mappers.getMapper(CursoMapper.class);

    CursoDTO toDTO(Curso entity);

    Curso toEntity(CursoDTO dto);

    List<CursoDTO> toDTOList(List<Curso> entities);

    List<Curso> toEntityList(List<CursoDTO> dtos);

    @Mapping(target = "id", ignore = true)
    void updateEntityFromDTO(CursoDTO dto, @MappingTarget Curso entity);
}
