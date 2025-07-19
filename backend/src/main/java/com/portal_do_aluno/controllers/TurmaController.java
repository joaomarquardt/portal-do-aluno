package com.portal_do_aluno.controllers;

import com.portal_do_aluno.dtos.requests.AddAlunosTurmaDTO;
import com.portal_do_aluno.dtos.requests.CreateTurmaRequestDTO;
import com.portal_do_aluno.dtos.requests.UpdateDesempenhoRequestDTO;
import com.portal_do_aluno.dtos.requests.UpdateTurmaRequestDTO;
import com.portal_do_aluno.dtos.responses.AlunoTurmaResponseDTO;
import com.portal_do_aluno.dtos.responses.DashboardAdminResponseDTO;
import com.portal_do_aluno.dtos.responses.TurmaResponseDTO;
import com.portal_do_aluno.services.TurmaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/turmas")
public class TurmaController {
    @Autowired
    private TurmaService service;

    @GetMapping
    public ResponseEntity<List<TurmaResponseDTO>> findAll() {
        List<TurmaResponseDTO> turmasDTO = service.findAll();
        return new ResponseEntity<>(turmasDTO, HttpStatus.OK);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<TurmaResponseDTO> findById(@PathVariable(value = "id") Long id) {
        TurmaResponseDTO turmaDTO = service.findById(id);
        return new ResponseEntity<>(turmaDTO, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<TurmaResponseDTO> create(@Valid @RequestBody CreateTurmaRequestDTO turmaDTO) {
        TurmaResponseDTO turmaCriadoDTO = service.create(turmaDTO);
        return new ResponseEntity<>(turmaCriadoDTO, HttpStatus.CREATED);
    }

    @PostMapping(value = "/{idTurma}/alunos")
    public ResponseEntity<TurmaResponseDTO> addStudentsToTheClass(@PathVariable(value = "idTurma") Long idTurma, @Valid @RequestBody AddAlunosTurmaDTO idAlunosDTO) {
        TurmaResponseDTO turmaDTO = service.addStudentsToTheClass(idTurma, idAlunosDTO.idAlunos());
        return new ResponseEntity<>(turmaDTO, HttpStatus.OK);
    }

    @GetMapping(value = "/{idTurma}/alunos")
    public ResponseEntity<List<AlunoTurmaResponseDTO>> getAllStudentsByClass(@PathVariable(value = "idTurma") Long idTurma) {
        List<AlunoTurmaResponseDTO> alunosTurmaDTO = service.getAllStudentsByClass(idTurma);
        return new ResponseEntity<>(alunosTurmaDTO, HttpStatus.OK);
    }

    @PutMapping(value = "/{idTurma}/alunos/{idAluno}")
    public ResponseEntity<Void> updateStudentPerformance(@PathVariable(value = "idTurma") Long idTurma, @PathVariable(value = "idAluno") Long idAluno, @Valid @RequestBody UpdateDesempenhoRequestDTO desempenhoDTO) {
        service.updateStudentPerformance(idTurma, idAluno, desempenhoDTO);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<TurmaResponseDTO> update(@PathVariable(value = "id") Long id, @Valid @RequestBody UpdateTurmaRequestDTO turmaDTO) {
        TurmaResponseDTO turmaAtualizadoDTO = service.update(id, turmaDTO);
        return new ResponseEntity<>(turmaAtualizadoDTO, HttpStatus.OK);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> delete(@PathVariable(value = "id") Long id) {
        service.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping(value = "/media-geral")
    public ResponseEntity<Double> generalAverageAllClasses() {
        Double mediaGeral = service.generalAverageAllClasses();
        return new ResponseEntity<>(mediaGeral, HttpStatus.OK);
    }

    @GetMapping(value = "/sumario-dashboard")
    public ResponseEntity<DashboardAdminResponseDTO> getAdminDashboardSummary() {
        DashboardAdminResponseDTO dashboardAdminDTO = service.getAdminDashboardSummary();
        return new ResponseEntity<>(dashboardAdminDTO, HttpStatus.OK);
    }
}