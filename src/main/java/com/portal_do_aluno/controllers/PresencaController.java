package com.portal_do_aluno.controllers;

import com.portal_do_aluno.dtos.PresencaDTO;
import com.portal_do_aluno.services.PresencaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/presencas")
public class PresencaController {
    @Autowired
    private PresencaService service;

    @GetMapping
    public ResponseEntity<List<PresencaDTO>> findAll() {
        List<PresencaDTO> presencasDTO = service.findAll();
        return new ResponseEntity<>(presencasDTO, HttpStatus.OK);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<PresencaDTO> findById(@PathVariable(value = "id") Long id) {
        PresencaDTO presencaDTO = service.findById(id);
        return new ResponseEntity<>(presencaDTO, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<PresencaDTO> create(@RequestBody PresencaDTO presencaDTO) {
        PresencaDTO presencaCriadoDTO = service.create(presencaDTO);
        return new ResponseEntity<>(presencaCriadoDTO, HttpStatus.CREATED);
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<PresencaDTO> update(@PathVariable(value = "id") Long id, @RequestBody PresencaDTO presencaDTO) {
        PresencaDTO presencaAtualizadoDTO = service.update(id, presencaDTO);
        return new ResponseEntity<>(presencaAtualizadoDTO, HttpStatus.OK);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> delete(@PathVariable(value = "id") Long id) {
        service.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}