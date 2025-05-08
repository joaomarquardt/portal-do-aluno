package com.portal_do_aluno.controllers;

import com.portal_do_aluno.dtos.ComunicadoDTO;
import com.portal_do_aluno.services.ComunicadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comunicados")
public class ComunicadoController {
    @Autowired
    private ComunicadoService service;

    @GetMapping
    public ResponseEntity<List<ComunicadoDTO>> findAll() {
        List<ComunicadoDTO> comunicadosDTO = service.findAll();
        return new ResponseEntity<>(comunicadosDTO, HttpStatus.OK);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<ComunicadoDTO> findById(@PathVariable(value = "id") Long id) {
        ComunicadoDTO comunicadoDTO = service.findById(id);
        return new ResponseEntity<>(comunicadoDTO, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<ComunicadoDTO> create(@RequestBody ComunicadoDTO comunicadoDTO) {
        ComunicadoDTO comunicadoCriadoDTO = service.create(comunicadoDTO);
        return new ResponseEntity<>(comunicadoCriadoDTO, HttpStatus.CREATED);
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<ComunicadoDTO> update(@PathVariable(value = "id") Long id, @RequestBody ComunicadoDTO comunicadoDTO) {
        ComunicadoDTO comunicadoAtualizadoDTO = service.update(id, comunicadoDTO);
        return new ResponseEntity<>(comunicadoAtualizadoDTO, HttpStatus.OK);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> delete(@PathVariable(value = "id") Long id) {
        service.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}