package com.portal_do_aluno.mappers;

import com.portal_do_aluno.domain.Turma;
import com.portal_do_aluno.dtos.requests.CreateTurmaRequestDTO;
import com.portal_do_aluno.dtos.requests.UpdateTurmaRequestDTO;
import com.portal_do_aluno.dtos.responses.TurmaResponseDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TurmaMapper {
    TurmaMapper INSTANCE = Mappers.getMapper(TurmaMapper.class);

    TurmaResponseDTO toResponseDTO(Turma entity);

    Turma toEntity(CreateTurmaRequestDTO dto);

    List<TurmaResponseDTO> toDTOResponseList(List<Turma> entities);

    @Mapping(target = "id", ignore = true)
    void updateEntityFromDTO(UpdateTurmaRequestDTO dto, @MappingTarget Turma entity);
}
