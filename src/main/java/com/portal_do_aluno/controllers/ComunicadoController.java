package com.portal_do_aluno.controllers;

import com.portal_do_aluno.dtos.requests.CreateComunicadoRequestDTO;
import com.portal_do_aluno.dtos.requests.UpdateComunicadoRequestDTO;
import com.portal_do_aluno.dtos.responses.ComunicadoResponseDTO;
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
    public ResponseEntity<List<ComunicadoResponseDTO>> findAll() {
        List<ComunicadoResponseDTO> comunicadosDTO = service.findAll();
        return new ResponseEntity<>(comunicadosDTO, HttpStatus.OK);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<ComunicadoResponseDTO> findById(@PathVariable(value = "id") Long id) {
        ComunicadoResponseDTO comunicadoDTO = service.findById(id);
        return new ResponseEntity<>(comunicadoDTO, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<ComunicadoResponseDTO> create(@RequestBody CreateComunicadoRequestDTO comunicadoDTO) {
        ComunicadoResponseDTO comunicadoCriadoDTO = service.create(comunicadoDTO);
        return new ResponseEntity<>(comunicadoCriadoDTO, HttpStatus.CREATED);
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<ComunicadoResponseDTO> update(@PathVariable(value = "id") Long id, @RequestBody UpdateComunicadoRequestDTO comunicadoDTO) {
        ComunicadoResponseDTO comunicadoAtualizadoDTO = service.update(id, comunicadoDTO);
        return new ResponseEntity<>(comunicadoAtualizadoDTO, HttpStatus.OK);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> delete(@PathVariable(value = "id") Long id) {
        service.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}