package com.portal_do_aluno.controllers;

import com.portal_do_aluno.dtos.AlunoDTO;
import com.portal_do_aluno.services.AlunoService;
import org.springframework.beans.factory.annotation.Autowired;
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
    public ResponseEntity<List<AlunoDTO>> findAll() {
        List<AlunoDTO> alunosDTO = service.findAll();
        return new ResponseEntity<>(alunosDTO, HttpStatus.OK);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<AlunoDTO> findById(@PathVariable(value = "id") Long id) {
        AlunoDTO alunoDTO = service.findById(id);
        return new ResponseEntity<>(alunoDTO, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<AlunoDTO> create(@RequestBody AlunoDTO alunoDTO) {
        AlunoDTO alunoCriadoDTO = service.create(alunoDTO);
        return new ResponseEntity<>(alunoCriadoDTO, HttpStatus.CREATED);
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<AlunoDTO> update(@PathVariable(value = "id") Long id, @RequestBody AlunoDTO alunoDTO) {
        AlunoDTO alunoAtualizadoDTO = service.update(id, alunoDTO);
        return new ResponseEntity<>(alunoAtualizadoDTO, HttpStatus.OK);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> delete(@PathVariable(value = "id") Long id) {
        service.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
