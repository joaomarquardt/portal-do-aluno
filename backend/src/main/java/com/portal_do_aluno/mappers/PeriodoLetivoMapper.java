package com.portal_do_aluno.mappers;

import com.portal_do_aluno.domain.PeriodoLetivo;
import com.portal_do_aluno.dtos.requests.CreatePeriodoLetivoRequestDTO;
import com.portal_do_aluno.dtos.requests.UpdatePeriodoLetivoRequestDTO;
import com.portal_do_aluno.dtos.responses.PeriodoLetivoResponseDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PeriodoLetivoMapper {
    PeriodoLetivoMapper INSTANCE = Mappers.getMapper(PeriodoLetivoMapper.class);

    PeriodoLetivoResponseDTO toResponseDTO(PeriodoLetivo entity);

    PeriodoLetivo toEntity(CreatePeriodoLetivoRequestDTO dto);

    List<PeriodoLetivoResponseDTO> toDTOList(List<PeriodoLetivo> entities);

    @Mapping(target = "id", ignore = true)
    void updateEntityFromDTO(UpdatePeriodoLetivoRequestDTO dto, @MappingTarget PeriodoLetivo entity);
}
