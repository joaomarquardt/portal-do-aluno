package com.portal_do_aluno.mappers;

import com.portal_do_aluno.domain.Aluno;
import com.portal_do_aluno.dtos.AlunoDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AlunoMapper {
    AlunoMapper INSTANCE = Mappers.getMapper(AlunoMapper.class);

    AlunoDTO toDTO(Aluno entity);

    Aluno toEntity(AlunoDTO dto);

    List<AlunoDTO> toDTOList(List<Aluno> entities);

    List<Aluno> toEntityList(List<AlunoDTO> dtos);

    @Mapping(target = "id", ignore = true)
    void updateEntityFromDTO(AlunoDTO dto, @MappingTarget Aluno entity);
}
