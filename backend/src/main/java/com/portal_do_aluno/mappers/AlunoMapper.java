package com.portal_do_aluno.mappers;

import com.portal_do_aluno.domain.Aluno;
import com.portal_do_aluno.dtos.requests.CreateAlunoRequestDTO;
import com.portal_do_aluno.dtos.requests.UpdateAlunoRequestDTO;
import com.portal_do_aluno.dtos.responses.AlunoResponseDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AlunoMapper {
    AlunoMapper INSTANCE = Mappers.getMapper(AlunoMapper.class);

    @Mapping(source = "usuario.nome", target = "nome")
    @Mapping(source = "usuario.cpf", target = "cpf")
    @Mapping(source = "usuario.emailInstitucional", target = "emailInstitucional")
    @Mapping(source = "usuario.emailPessoal", target = "emailPessoal")
    @Mapping(source = "usuario.telefone", target = "telefone")
    AlunoResponseDTO toResponseDTO(Aluno entity);

    Aluno toEntity(CreateAlunoRequestDTO dto);

    @Mapping(source = "usuario.nome", target = "nome")
    @Mapping(source = "usuario.cpf", target = "cpf")
    @Mapping(source = "usuario.emailInstitucional", target = "emailInstitucional")
    @Mapping(source = "usuario.emailPessoal", target = "emailPessoal")
    @Mapping(source = "usuario.telefone", target = "telefone")
    List<AlunoResponseDTO> toDTOResponseList(List<Aluno> entities);

    @Mapping(target = "id", ignore = true)
    @Mapping(source = "emailPessoal", target = "usuario.emailPessoal")
    @Mapping(source = "telefone", target = "usuario.telefone")
    void updateEntityFromDTO(UpdateAlunoRequestDTO dto, @MappingTarget Aluno entity);
}
