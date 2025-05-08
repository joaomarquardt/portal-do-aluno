package com.portal_do_aluno.mappers;

import com.portal_do_aluno.domain.Disciplina;
import com.portal_do_aluno.dtos.DisciplinaDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface DisciplinaMapper {
    DisciplinaMapper INSTANCE = Mappers.getMapper(DisciplinaMapper.class);

    DisciplinaDTO toDTO(Disciplina entity);

    Disciplina toEntity(DisciplinaDTO dto);

    List<DisciplinaDTO> toDTOList(List<Disciplina> entities);

    List<Disciplina> toEntityList(List<DisciplinaDTO> dtos);

    @Mapping(target = "id", ignore = true)
    void updateEntityFromDTO(DisciplinaDTO dto, @MappingTarget Disciplina entity);
}
