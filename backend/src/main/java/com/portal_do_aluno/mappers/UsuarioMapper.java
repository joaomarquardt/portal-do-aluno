package com.portal_do_aluno.mappers;

import com.portal_do_aluno.domain.Usuario;
import com.portal_do_aluno.dtos.requests.CreateUsuarioRequestDTO;
import com.portal_do_aluno.dtos.requests.UpdateUsuarioRequestDTO;
import com.portal_do_aluno.dtos.responses.UsuarioResponseDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UsuarioMapper {
    UsuarioMapper INSTANCE = Mappers.getMapper(UsuarioMapper.class);

    UsuarioResponseDTO toResponseDTO(Usuario entity);

    Usuario toEntity(CreateUsuarioRequestDTO dto);

    List<UsuarioResponseDTO> toDTOResponseList(List<Usuario> entities);

    @Mapping(target = "id", ignore = true)
    void updateEntityFromDTO(UpdateUsuarioRequestDTO dto, @MappingTarget Usuario entity);
}
