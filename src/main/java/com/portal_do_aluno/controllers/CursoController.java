package com.portal_do_aluno.controllers;

import com.portal_do_aluno.domain.Curso;
import com.portal_do_aluno.dtos.CursoDTO;
import com.portal_do_aluno.services.CursoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cursos")
public class CursoController {
    @Autowired
    private CursoService service;

    @GetMapping
    public ResponseEntity<List<CursoDTO>> findAll() {
        List<CursoDTO> cursosDTO = service.findAll();
        return new ResponseEntity<>(cursosDTO, HttpStatus.OK);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<CursoDTO> findById(@PathVariable(value = "id") Long id) {
        CursoDTO cursoDTO = service.findById(id);
        return new ResponseEntity<>(cursoDTO, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<CursoDTO> create(@RequestBody CursoDTO cursoDTO) {
        CursoDTO cursoCriadoDTO = service.create(cursoDTO);
        return new ResponseEntity<>(cursoCriadoDTO, HttpStatus.CREATED);
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<CursoDTO> update(@PathVariable(value = "id") Long id, @RequestBody CursoDTO cursoDTO) {
        CursoDTO cursoAtualizadoDTO = service.update(id, cursoDTO);
        return new ResponseEntity<>(cursoAtualizadoDTO, HttpStatus.OK);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> delete(@PathVariable(value = "id") Long id) {
        service.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}