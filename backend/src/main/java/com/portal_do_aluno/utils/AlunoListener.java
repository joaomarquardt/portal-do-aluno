package com.portal_do_aluno.utils;

import com.alibaba.excel.context.AnalysisContext;
import com.alibaba.excel.event.AnalysisEventListener;
import com.alibaba.excel.metadata.CellExtra;
import com.portal_do_aluno.dtos.excel.AlunoExcelDTO;
import com.portal_do_aluno.dtos.requests.CreateAlunoRequestDTO;
import com.portal_do_aluno.security.domain.PapelUsuario;
import com.portal_do_aluno.security.dtos.requests.RegisterRequestDTO;
import com.portal_do_aluno.services.UsuarioService;

import java.util.List;

public class AlunoListener extends AnalysisEventListener<AlunoExcelDTO> {

    private final UsuarioService usuarioService;

    public AlunoListener(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @Override
    public void onException(Exception exception, AnalysisContext context) throws Exception {
        super.onException(exception, context);
    }

    @Override
    public void invoke(AlunoExcelDTO alunoExcelDTO, AnalysisContext context) {
        int linha = context.readRowHolder().getRowIndex() + 1;
        String prefixoErro = "Erro na linha " + linha + ": ";
        StringBuilder erro = new StringBuilder(prefixoErro);

        if (alunoExcelDTO.getNome() == null || alunoExcelDTO.getNome().isBlank()) {
            erro.append("Nome vazio. ");
        }
        if (alunoExcelDTO.getCpf() == null || !alunoExcelDTO.getCpf().matches("\\d{11}")) {
            erro.append("CPF inválido. ");
        }
        if (alunoExcelDTO.getEmailPessoal() == null || !alunoExcelDTO.getEmailPessoal().contains("@")) {
            erro.append("Email pessoal inválido. ");
        }
        if (alunoExcelDTO.getEmailInstitucional() == null || !alunoExcelDTO.getEmailInstitucional().contains("@")) {
            erro.append("Email institucional inválido. ");
        }
        if (alunoExcelDTO.getTelefone() != null && !alunoExcelDTO.getTelefone().matches("\\d{11}")) {
            erro.append("Telefone inválido. ");
        }
        if (alunoExcelDTO.getIdCurso() == null) {
            erro.append("ID do curso inválido.");
        }

        if (!erro.toString().equals(prefixoErro)) {
            throw new RuntimeException(erro.toString());
        }

        List<PapelUsuario> papeis = List.of(PapelUsuario.ALUNO);
        RegisterRequestDTO registerDTO = new RegisterRequestDTO(alunoExcelDTO.getNome(), alunoExcelDTO.getCpf(),
                alunoExcelDTO.getEmailPessoal(), alunoExcelDTO.getEmailInstitucional(), alunoExcelDTO.getTelefone(), "", new CreateAlunoRequestDTO(Integer.toUnsignedLong(alunoExcelDTO.getIdCurso())), null, papeis);
        usuarioService.create(registerDTO);

    }

    @Override
    public void extra(CellExtra extra, AnalysisContext context) {
        super.extra(extra, context);
    }

    @Override
    public void doAfterAllAnalysed(AnalysisContext analysisContext) {
        System.out.println("Arquivo de alunos lido com sucesso!");
    }

    @Override
    public boolean hasNext(AnalysisContext context) {
        return super.hasNext(context);
    }
}
