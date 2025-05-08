package com.portal_do_aluno.controllers;

import com.portal_do_aluno.domain.Turma;
import com.portal_do_aluno.dtos.TurmaDTO;
import com.portal_do_aluno.services.TurmaService;
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
    public ResponseEntity<List<TurmaDTO>> findAll() {
        List<TurmaDTO> turmasDTO = service.findAll();
        return new ResponseEntity<>(turmasDTO, HttpStatus.OK);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<TurmaDTO> findById(@PathVariable(value = "id") Long id) {
        TurmaDTO turmaDTO = service.findById(id);
        return new ResponseEntity<>(turmaDTO, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<TurmaDTO> create(@RequestBody TurmaDTO turmaDTO) {
        TurmaDTO turmaCriadoDTO = service.create(turmaDTO);
        return new ResponseEntity<>(turmaCriadoDTO, HttpStatus.CREATED);
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<TurmaDTO> update(@PathVariable(value = "id") Long id, @RequestBody TurmaDTO turmaDTO) {
        TurmaDTO turmaAtualizadoDTO = service.update(id, turmaDTO);
        return new ResponseEntity<>(turmaAtualizadoDTO, HttpStatus.OK);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> delete(@PathVariable(value = "id") Long id) {
        service.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}

