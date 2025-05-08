package com.portal_do_aluno.controllers;


import com.portal_do_aluno.domain.Professor;
import com.portal_do_aluno.dtos.ProfessorDTO;
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
    public ResponseEntity<List<ProfessorDTO>> findAll() {
        List<ProfessorDTO> professoresDTO = service.findAll();
        return new ResponseEntity<>(professoresDTO, HttpStatus.OK);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<ProfessorDTO> findById(@PathVariable(value = "id") Long id) {
        ProfessorDTO professorDTO = service.findById(id);
        return new ResponseEntity<>(professorDTO, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<ProfessorDTO> create(@RequestBody ProfessorDTO professorDTO) {
        ProfessorDTO professorCriadoDTO = service.create(professorDTO);
        return new ResponseEntity<>(professorCriadoDTO, HttpStatus.CREATED);
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<ProfessorDTO> update(@PathVariable(value = "id") Long id, @RequestBody ProfessorDTO professorDTO) {
        ProfessorDTO professorAtualizadoDTO = service.update(id, professorDTO);
        return new ResponseEntity<>(professorAtualizadoDTO, HttpStatus.OK);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> delete(@PathVariable(value = "id") Long id) {
        service.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
