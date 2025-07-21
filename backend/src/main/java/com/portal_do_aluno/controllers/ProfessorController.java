package com.portal_do_aluno.controllers;

import com.portal_do_aluno.dtos.requests.CreateProfessorRequestDTO;
import com.portal_do_aluno.dtos.requests.UpdateProfessorRequestDTO;
import com.portal_do_aluno.dtos.responses.*;
import com.portal_do_aluno.services.ProfessorService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/professores")
public class ProfessorController {
    @Autowired
    private ProfessorService service;

    @GetMapping
    public ResponseEntity<List<ProfessorResponseDTO>> findAll() {
        List<ProfessorResponseDTO> professoresDTO = service.findAll();
        return new ResponseEntity<>(professoresDTO, HttpStatus.OK);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<ProfessorResponseDTO> findById(@PathVariable(value = "id") Long id) {
        ProfessorResponseDTO professorDTO = service.findById(id);
        return new ResponseEntity<>(professorDTO, HttpStatus.OK);
    }

    @GetMapping("/select")
    public ResponseEntity<List<ProfessorResponseDTO>> listAllToSelect() {
        List<ProfessorResponseDTO> professoresDTO = service.listAllToSelect();
        return new ResponseEntity<>(professoresDTO, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<ProfessorResponseDTO> create(@Valid @RequestBody CreateProfessorRequestDTO professorDTO) {
        ProfessorResponseDTO professorCriadoDTO = service.create(professorDTO);
        return new ResponseEntity<>(professorCriadoDTO, HttpStatus.CREATED);
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<ProfessorResponseDTO> update(@PathVariable(value = "id") Long id, @Valid @RequestBody UpdateProfessorRequestDTO professorDTO) {
        ProfessorResponseDTO professorAtualizadoDTO = service.update(id, professorDTO);
        return new ResponseEntity<>(professorAtualizadoDTO, HttpStatus.OK);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> delete(@PathVariable(value = "id") Long id) {
        service.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping(value = "/{id}/sumario-dashboard")
    public ResponseEntity<DashboardProfessorResponseDTO> getProfessorDashboardSummary(@PathVariable(value = "id") Long id) {
        DashboardProfessorResponseDTO dashboardProfessorDTO = service.getProfessorDashboardSummary(id);
        return new ResponseEntity<>(dashboardProfessorDTO, HttpStatus.OK);
    }

    @GetMapping(value = "/{id}/turmas-ativas")
    public ResponseEntity<List<TurmaDesempenhoResponseDTO>> getActiveClassesByProfessor(@PathVariable(value = "id") Long id) {
        List<TurmaDesempenhoResponseDTO> turmasAtivasProfessorDTO = service.getActiveClassesByProfessor(id);
        return new ResponseEntity<>(turmasAtivasProfessorDTO, HttpStatus.OK);
    }
}