package com.portal_do_aluno.controllers;

import com.portal_do_aluno.dtos.requests.CreatePeriodoLetivoRequestDTO;
import com.portal_do_aluno.dtos.requests.UpdatePeriodoLetivoRequestDTO;
import com.portal_do_aluno.dtos.responses.PeriodoLetivoResponseDTO;
import com.portal_do_aluno.services.PeriodoLetivoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/periodos-letivos")
public class PeriodoLetivoController {
    @Autowired
    private PeriodoLetivoService service;

    @GetMapping
    public ResponseEntity<List<PeriodoLetivoResponseDTO>> findAll() {
        List<PeriodoLetivoResponseDTO> periodosLetivosDTO = service.findAll();
        return new ResponseEntity<>(periodosLetivosDTO, HttpStatus.OK);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<PeriodoLetivoResponseDTO> findById(@PathVariable(value = "id") Long id) {
        PeriodoLetivoResponseDTO periodoLetivoDTO = service.findById(id);
        return new ResponseEntity<>(periodoLetivoDTO, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<PeriodoLetivoResponseDTO> create(@Valid @RequestBody CreatePeriodoLetivoRequestDTO periodoLetivoDTO) {
        PeriodoLetivoResponseDTO periodoLetivoCriadoDTO = service.create(periodoLetivoDTO);
        return new ResponseEntity<>(periodoLetivoCriadoDTO, HttpStatus.CREATED);
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<PeriodoLetivoResponseDTO> update(@PathVariable(value = "id") Long id, @Valid @RequestBody UpdatePeriodoLetivoRequestDTO periodoLetivoDTO) {
        PeriodoLetivoResponseDTO periodoLetivoAtualizadoDTO = service.update(id, periodoLetivoDTO);
        return new ResponseEntity<>(periodoLetivoAtualizadoDTO, HttpStatus.OK);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> delete(@PathVariable(value = "id") Long id) {
        service.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}