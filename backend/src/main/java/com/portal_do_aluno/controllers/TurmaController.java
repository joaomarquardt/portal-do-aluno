package com.portal_do_aluno.controllers;

import com.portal_do_aluno.dtos.requests.AddAlunosTurmaDTO;
import com.portal_do_aluno.dtos.requests.CreateTurmaRequestDTO;
import com.portal_do_aluno.dtos.requests.UpdateDesempenhoRequestDTO;
import com.portal_do_aluno.dtos.requests.UpdateTurmaRequestDTO;
import com.portal_do_aluno.dtos.responses.TurmaResponseDTO;
import com.portal_do_aluno.services.TurmaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/turmas")
public class TurmaController {
    @Autowired
    private TurmaService service;

    @GetMapping
    public ResponseEntity<List<TurmaResponseDTO>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TurmaResponseDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<TurmaResponseDTO> create(@RequestBody @Valid CreateTurmaRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(dto));
    }

    @PostMapping("/{idTurma}/alunos")
    public ResponseEntity<TurmaResponseDTO> addStudentsToTheClass(
        @PathVariable Long idTurma,
        @RequestBody @Valid AddAlunosTurmaDTO dto
    ) {
        return ResponseEntity.ok(service.addStudentsToTheClass(idTurma, dto.idAlunos()));
    }

    @PutMapping("/{idTurma}/alunos/{idAluno}")
    public ResponseEntity<Void> updateStudentPerformance(
        @PathVariable Long idTurma,
        @PathVariable Long idAluno,
        @RequestBody @Valid UpdateDesempenhoRequestDTO dto
    ) {
        service.updateStudentPerformance(idTurma, idAluno, dto);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<TurmaResponseDTO> update(
        @PathVariable Long id,
        @RequestBody @Valid UpdateTurmaRequestDTO dto
    ) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();

    }
    @GetMapping(value = "/media-geral")
    public ResponseEntity<Double> generalAverageAllClasses() {
         Double mediaGeral = service.generalAverageAllClasses();
         return new ResponseEntity<>(mediaGeral, HttpStatus.OK);

    }
}
