package com.portal_do_aluno.mappers;

import com.portal_do_aluno.domain.Usuario;
import com.portal_do_aluno.dtos.UsuarioDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UsuarioMapper {
    UsuarioMapper INSTANCE = Mappers.getMapper(UsuarioMapper.class);

    UsuarioDTO toDTO(Usuario entity);

    Usuario toEntity(UsuarioDTO dto);

    List<UsuarioDTO> toDTOList(List<Usuario> entities);

    List<Usuario> toEntityList(List<UsuarioDTO> dtos);

    @Mapping(target = "id", ignore = true)
    void updateEntityFromDTO(UsuarioDTO dto, @MappingTarget Usuario entity);
}
