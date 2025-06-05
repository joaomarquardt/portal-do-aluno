package com.portal_do_aluno.controllers;

import com.portal_do_aluno.dtos.requests.CreateProfessorRequestDTO;
import com.portal_do_aluno.dtos.requests.UpdateProfessorRequestDTO;
import com.portal_do_aluno.dtos.responses.ProfessorResponseDTO;
import com.portal_do_aluno.services.ProfessorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/professors")
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

    @PostMapping
    public ResponseEntity<ProfessorResponseDTO> create(@RequestBody CreateProfessorRequestDTO professorDTO) {
        ProfessorResponseDTO professorCriadoDTO = service.create(professorDTO);
        return new ResponseEntity<>(professorCriadoDTO, HttpStatus.CREATED);
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<ProfessorResponseDTO> update(@PathVariable(value = "id") Long id, @RequestBody UpdateProfessorRequestDTO professorDTO) {
        ProfessorResponseDTO professorAtualizadoDTO = service.update(id, professorDTO);
        return new ResponseEntity<>(professorAtualizadoDTO, HttpStatus.OK);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> delete(@PathVariable(value = "id") Long id) {
        service.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
