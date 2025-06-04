package com.portal_do_aluno.mappers;

import com.portal_do_aluno.domain.Disciplina;
import com.portal_do_aluno.dtos.requests.CreateDisciplinaRequestDTO;
import com.portal_do_aluno.dtos.requests.UpdateDisciplinaRequestDTO;
import com.portal_do_aluno.dtos.responses.DisciplinaResponseDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface DisciplinaMapper {
    DisciplinaMapper INSTANCE = Mappers.getMapper(DisciplinaMapper.class);

    DisciplinaResponseDTO toResponseDTO(Disciplina entity);

    Disciplina toEntity(CreateDisciplinaRequestDTO dto);

    List<DisciplinaResponseDTO> toDTOResponseList(List<Disciplina> entities);

    @Mapping(target = "id", ignore = true)
    void updateEntityFromDTO(UpdateDisciplinaRequestDTO dto, @MappingTarget Disciplina entity);
}
