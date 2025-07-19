package com.portal_do_aluno.controllers;

import com.portal_do_aluno.dtos.requests.CreateDisciplinaRequestDTO;
import com.portal_do_aluno.dtos.requests.UpdateDisciplinaRequestDTO;
import com.portal_do_aluno.dtos.responses.DisciplinaResponseDTO;
import com.portal_do_aluno.services.DisciplinaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/disciplinas")
public class DisciplinaController {
    @Autowired
    private DisciplinaService service;

    @GetMapping
    public ResponseEntity<List<DisciplinaResponseDTO>> findAll() {
        List<DisciplinaResponseDTO> disciplinasDTO = service.findAll();
        return new ResponseEntity<>(disciplinasDTO, HttpStatus.OK);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<DisciplinaResponseDTO> findById(@PathVariable(value = "id") Long id) {
        DisciplinaResponseDTO disciplinaDTO = service.findById(id);
        return new ResponseEntity<>(disciplinaDTO, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<DisciplinaResponseDTO> create(@Valid @RequestBody CreateDisciplinaRequestDTO disciplinaDTO) {
        DisciplinaResponseDTO disciplinaCriadoDTO = service.create(disciplinaDTO);
        return new ResponseEntity<>(disciplinaCriadoDTO, HttpStatus.CREATED);
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<DisciplinaResponseDTO> update(@PathVariable(value = "id") Long id, @Valid @RequestBody UpdateDisciplinaRequestDTO disciplinaDTO) {
        DisciplinaResponseDTO disciplinaAtualizadoDTO = service.update(id, disciplinaDTO);
        return new ResponseEntity<>(disciplinaAtualizadoDTO, HttpStatus.OK);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> delete(@PathVariable(value = "id") Long id) {
        service.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}