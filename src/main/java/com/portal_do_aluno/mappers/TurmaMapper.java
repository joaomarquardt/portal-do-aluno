package com.portal_do_aluno.mappers;

import com.portal_do_aluno.domain.Turma;
import com.portal_do_aluno.dtos.TurmaDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TurmaMapper {
    TurmaMapper INSTANCE = Mappers.getMapper(TurmaMapper.class);

    TurmaDTO toDTO(Turma entity);

    Turma toEntity(TurmaDTO dto);

    List<TurmaDTO> toDTOList(List<Turma> entities);

    List<Turma> toEntityList(List<TurmaDTO> dtos);

    @Mapping(target = "id", ignore = true)
    void updateEntityFromDTO(TurmaDTO dto, @MappingTarget Turma entity);
}
