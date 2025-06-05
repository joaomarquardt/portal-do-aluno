package com.portal_do_aluno.mappers;

import com.portal_do_aluno.domain.Curso;
import com.portal_do_aluno.dtos.requests.CreateCursoRequestDTO;
import com.portal_do_aluno.dtos.requests.UpdateCursoRequestDTO;
import com.portal_do_aluno.dtos.responses.CursoResponseDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CursoMapper {
    CursoMapper INSTANCE = Mappers.getMapper(CursoMapper.class);

    CursoResponseDTO toResponseDTO(Curso entity);

    Curso toEntity(CreateCursoRequestDTO dto);

    List<CursoResponseDTO> toDTOResponseList(List<Curso> entities);

    @Mapping(target = "id", ignore = true)
    void updateEntityFromDTO(UpdateCursoRequestDTO dto, @MappingTarget Curso entity);
}
