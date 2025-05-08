package com.portal_do_aluno.mappers;

import com.portal_do_aluno.domain.Professor;
import com.portal_do_aluno.dtos.ProfessorDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProfessorMapper {
    ProfessorMapper INSTANCE = Mappers.getMapper(ProfessorMapper.class);

    ProfessorDTO toDTO(Professor entity);

    Professor toEntity(ProfessorDTO dto);

    List<ProfessorDTO> toDTOList(List<Professor> entities);

    List<Professor> toEntityList(List<ProfessorDTO> dtos);

    @Mapping(target = "id", ignore = true)
    void updateEntityFromDTO(ProfessorDTO dto, @MappingTarget Professor entity);
}
