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
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PeriodoLetivoResponseDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<PeriodoLetivoResponseDTO> create(@RequestBody @Valid CreatePeriodoLetivoRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PeriodoLetivoResponseDTO> update(
        @PathVariable Long id,
        @RequestBody @Valid UpdatePeriodoLetivoRequestDTO dto
    ) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
