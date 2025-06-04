package com.portal_do_aluno.mappers;

import com.portal_do_aluno.domain.Professor;
import com.portal_do_aluno.dtos.requests.CreateProfessorRequestDTO;
import com.portal_do_aluno.dtos.requests.UpdateProfessorRequestDTO;
import com.portal_do_aluno.dtos.responses.ProfessorResponseDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProfessorMapper {
    ProfessorMapper INSTANCE = Mappers.getMapper(ProfessorMapper.class);

    ProfessorResponseDTO toResponseDTO(Professor entity);

    Professor toEntity(CreateProfessorRequestDTO dto);

    Professor toResponseEntity(ProfessorResponseDTO dto);

    List<ProfessorResponseDTO> toDTOResponseList(List<Professor> entities);

    @Mapping(target = "id", ignore = true)
    void updateEntityFromDTO(UpdateProfessorRequestDTO dto, @MappingTarget Professor entity);
}
