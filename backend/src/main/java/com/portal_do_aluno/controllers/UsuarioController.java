package com.portal_do_aluno.controllers;

import com.portal_do_aluno.dtos.requests.UpdateUsuarioRequestDTO;
import com.portal_do_aluno.dtos.responses.UsuarioResponseDTO;
import com.portal_do_aluno.services.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {
    @Autowired
    private UsuarioService service;

    @GetMapping
    public ResponseEntity<List<UsuarioResponseDTO>> findAll() {
        List<UsuarioResponseDTO> usuariosDTO = service.findAll();
        return new ResponseEntity<>(usuariosDTO, HttpStatus.OK);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<UsuarioResponseDTO> findById(@PathVariable(value = "id") Long id) {
        UsuarioResponseDTO usuarioDTO = service.findById(id);
        return new ResponseEntity<>(usuarioDTO, HttpStatus.OK);
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<UsuarioResponseDTO> update(@PathVariable(value = "id") Long id, @Valid @RequestBody UpdateUsuarioRequestDTO usuarioDTO) {
        UsuarioResponseDTO usuarioAtualizadoDTO = service.update(id, usuarioDTO);
        return new ResponseEntity<>(usuarioAtualizadoDTO, HttpStatus.OK);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> delete(@PathVariable(value = "id") Long id) {
        service.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}