package com.portal_do_aluno.controllers;

import com.portal_do_aluno.domain.Disciplina;
import com.portal_do_aluno.dtos.DisciplinaDTO;
import com.portal_do_aluno.services.DisciplinaService;
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
    public ResponseEntity<List<DisciplinaDTO>> findAll() {
        List<DisciplinaDTO> disciplinasDTO = service.findAll();
        return new ResponseEntity<>(disciplinasDTO, HttpStatus.OK);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<DisciplinaDTO> findById(@PathVariable(value = "id") Long id) {
        DisciplinaDTO disciplinaDTO = service.findById(id);
        return new ResponseEntity<>(disciplinaDTO, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<DisciplinaDTO> create(@RequestBody DisciplinaDTO disciplinaDTO) {
        DisciplinaDTO disciplinaCriadoDTO = service.create(disciplinaDTO);
        return new ResponseEntity<>(disciplinaCriadoDTO, HttpStatus.CREATED);
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<DisciplinaDTO> update(@PathVariable(value = "id") Long id, @RequestBody DisciplinaDTO disciplinaDTO) {
        DisciplinaDTO disciplinaAtualizadoDTO = service.update(id, disciplinaDTO);
        return new ResponseEntity<>(disciplinaAtualizadoDTO, HttpStatus.OK);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> delete(@PathVariable(value = "id") Long id) {
        service.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
