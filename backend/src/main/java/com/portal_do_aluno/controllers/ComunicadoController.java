package com.portal_do_aluno.controllers;

import com.portal_do_aluno.dtos.requests.CreateComunicadoRequestDTO;
import com.portal_do_aluno.dtos.requests.UpdateComunicadoRequestDTO;
import com.portal_do_aluno.dtos.responses.ComunicadoResponseDTO;
import com.portal_do_aluno.services.ComunicadoService;
import jakarta.validation.Valid;
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
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ComunicadoResponseDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<ComunicadoResponseDTO> create(@RequestBody @Valid CreateComunicadoRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ComunicadoResponseDTO> update(
        @PathVariable Long id,
        @RequestBody @Valid UpdateComunicadoRequestDTO dto
    ) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
