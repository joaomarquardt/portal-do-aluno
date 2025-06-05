package com.portal_do_aluno.controllers;

import com.portal_do_aluno.dtos.requests.CreateTurmaRequestDTO;
import com.portal_do_aluno.dtos.requests.UpdateTurmaRequestDTO;
import com.portal_do_aluno.dtos.responses.TurmaResponseDTO;
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
    public ResponseEntity<TurmaResponseDTO> create(@RequestBody CreateTurmaRequestDTO turmaDTO) {
        TurmaResponseDTO turmaCriadoDTO = service.create(turmaDTO);
        return new ResponseEntity<>(turmaCriadoDTO, HttpStatus.CREATED);
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<TurmaResponseDTO> update(@PathVariable(value = "id") Long id, @RequestBody UpdateTurmaRequestDTO turmaDTO) {
        TurmaResponseDTO turmaAtualizadoDTO = service.update(id, turmaDTO);
        return new ResponseEntity<>(turmaAtualizadoDTO, HttpStatus.OK);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> delete(@PathVariable(value = "id") Long id) {
        service.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}

