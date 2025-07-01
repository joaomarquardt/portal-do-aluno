package com.portal_do_aluno.controllers;

import com.portal_do_aluno.dtos.requests.CreateAlunoRequestDTO;
import com.portal_do_aluno.dtos.requests.UpdateAlunoRequestDTO;
import com.portal_do_aluno.dtos.responses.AlunoResponseDTO;
import com.portal_do_aluno.dtos.responses.DesempenhoResponseDTO;
import com.portal_do_aluno.services.AlunoService;
import jakarta.validation.Valid;
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
    public ResponseEntity<List<AlunoResponseDTO>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AlunoResponseDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<AlunoResponseDTO> create(@RequestBody @Valid CreateAlunoRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AlunoResponseDTO> update(
        @PathVariable Long id,
        @RequestBody @Valid UpdateAlunoRequestDTO dto
    ) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/desempenho")
    public ResponseEntity<List<DesempenhoResponseDTO>> getSchoolPerformance(@PathVariable Long id) {
        return ResponseEntity.ok(service.getSchoolPerformance(id));
    }

    @GetMapping(value = "/total-alunos")
    public ResponseEntity<Long> getNumberOfStudents(@RequestParam(required = false) Boolean matriculado) {
        Long totalAlunosAtivos = service.getNumberOfStudents(matriculado);
        return new ResponseEntity<>(totalAlunosAtivos, HttpStatus.OK);
    }
}
