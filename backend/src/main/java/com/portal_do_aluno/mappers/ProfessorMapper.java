package com.portal_do_aluno.mappers;

import com.portal_do_aluno.domain.Professor;
import com.portal_do_aluno.dtos.requests.CreateProfessorRequestDTO;
import com.portal_do_aluno.dtos.requests.UpdateProfessorRequestDTO;
import com.portal_do_aluno.dtos.responses.ProfessorResponseDTO;
import com.portal_do_aluno.dtos.responses.ProfessorSelectResponseDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProfessorMapper {
    ProfessorMapper INSTANCE = Mappers.getMapper(ProfessorMapper.class);

    @Mapping(source = "usuario.nome", target = "nome")
    @Mapping(source = "usuario.cpf", target = "cpf")
    @Mapping(source = "usuario.emailInstitucional", target = "emailInstitucional")
    @Mapping(source = "usuario.emailPessoal", target = "emailPessoal")
    @Mapping(source = "usuario.telefone", target = "telefone")
    ProfessorResponseDTO toResponseDTO(Professor entity);

    Professor toEntity(CreateProfessorRequestDTO dto);

    Professor toResponseEntity(ProfessorResponseDTO dto);

    @Mapping(source = "usuario.nome", target = "nome")
    @Mapping(source = "usuario.cpf", target = "cpf")
    @Mapping(source = "usuario.emailInstitucional", target = "emailInstitucional")
    @Mapping(source = "usuario.emailPessoal", target = "emailPessoal")
    @Mapping(source = "usuario.telefone", target = "telefone")
    List<ProfessorResponseDTO> toDTOResponseList(List<Professor> entities);

    List<ProfessorSelectResponseDTO> toDTOSelectResponseList(List<Professor> entities);

    @Mapping(target = "id", ignore = true)
    @Mapping(source = "emailPessoal", target = "usuario.emailPessoal")
    @Mapping(source = "telefone", target = "usuario.telefone")
    void updateEntityFromDTO(UpdateProfessorRequestDTO dto, @MappingTarget Professor entity);
}
