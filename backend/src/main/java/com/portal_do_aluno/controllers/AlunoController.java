package com.portal_do_aluno.controllers;

import com.portal_do_aluno.dtos.requests.CreateAlunoRequestDTO;
import com.portal_do_aluno.dtos.requests.UpdateAlunoRequestDTO;
import com.portal_do_aluno.dtos.responses.AlunoResponseDTO;
import com.portal_do_aluno.dtos.responses.DashboardAlunoResponseDTO;
import com.portal_do_aluno.dtos.responses.DesempenhoResponseDTO;
import com.portal_do_aluno.services.AlunoService;
import jakarta.annotation.Nullable;
import jakarta.websocket.server.PathParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/alunos")
public class AlunoController {
    @Autowired
    private AlunoService service;

    @GetMapping
    public ResponseEntity<List<AlunoResponseDTO>> findAll() {
        List<AlunoResponseDTO> alunosDTO = service.findAll();
        return new ResponseEntity<>(alunosDTO, HttpStatus.OK);
    }

    @GetMapping(value = "/paginacao")
    public Page<AlunoResponseDTO> findAllPageable(@PageableDefault(size = 9) Pageable pageable, @RequestParam(required = false) @Nullable String nome) {
        if (nome != null && !nome.isEmpty()) {
            return service.findByNomeContainingIgnoreCase(nome, pageable);
        }
        return service.findAll(pageable);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<AlunoResponseDTO> findById(@PathVariable(value = "id") Long id) {
        AlunoResponseDTO alunoDTO = service.findById(id);
        return new ResponseEntity<>(alunoDTO, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<AlunoResponseDTO> create(@RequestBody CreateAlunoRequestDTO alunoDTO) {
        AlunoResponseDTO alunoCriadoDTO = service.create(alunoDTO);
        return new ResponseEntity<>(alunoCriadoDTO, HttpStatus.CREATED);
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<AlunoResponseDTO> update(@PathVariable(value = "id") Long id, @RequestBody UpdateAlunoRequestDTO alunoDTO) {
        AlunoResponseDTO alunoAtualizadoDTO = service.update(id, alunoDTO);
        return new ResponseEntity<>(alunoAtualizadoDTO, HttpStatus.OK);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> delete(@PathVariable(value = "id") Long id) {
        service.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping(value = "/{id}/desempenho-geral")
    public ResponseEntity<List<DesempenhoResponseDTO>> getSchoolPerformance(@PathVariable(value = "id") Long id) {
        List<DesempenhoResponseDTO> desempenhosDTO = service.getSchoolPerformance(id);
        return new ResponseEntity<>(desempenhosDTO, HttpStatus.OK);
    }

    @GetMapping(value = "/total-alunos")
    public ResponseEntity<Long> getNumberOfStudents(@RequestParam(required = false) Boolean matriculado) {
        Long totalAlunosAtivos = service.getNumberOfStudents(matriculado);
        return new ResponseEntity<>(totalAlunosAtivos   , HttpStatus.OK);
    }

    @GetMapping(value = "/{id}/turmas")
    public ResponseEntity<List<DesempenhoResponseDTO>> getStudentClasses(@PathVariable(value = "id") Long id, @RequestParam(required = false) Boolean turmaAtiva) {
        List<DesempenhoResponseDTO> desempenhosDTO = service.getStudentClasses(id, turmaAtiva);
        return new ResponseEntity<>(desempenhosDTO, HttpStatus.OK);
    }

    @GetMapping(value = "/{id}/sumario-dashboard")
    public ResponseEntity<DashboardAlunoResponseDTO> getStudentDashboardSummary(@PathVariable(value = "id") Long id) {
        DashboardAlunoResponseDTO dashboardAlunoDTO = service.getStudentDashboardSummary(id);
        return new ResponseEntity<>(dashboardAlunoDTO, HttpStatus.OK);
    }
}
