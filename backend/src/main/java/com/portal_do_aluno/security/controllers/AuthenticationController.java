package com.portal_do_aluno.security.controllers;

import com.portal_do_aluno.security.dtos.requests.AtualizarSenhaRequestDTO;
import com.portal_do_aluno.security.dtos.requests.AuthRequestDTO;
import com.portal_do_aluno.security.dtos.requests.RegisterRequestDTO;
import com.portal_do_aluno.security.dtos.responses.AuthResponseDTO;
import com.portal_do_aluno.security.services.AuthenticationService;
import com.portal_do_aluno.services.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {
    @Autowired
    private AuthenticationService service;

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody AuthRequestDTO authDTO) {
        AuthResponseDTO authResponseDTO = service.login(authDTO);
        return new ResponseEntity<>(authResponseDTO, HttpStatus.OK);
    }

    @PostMapping("/register")
    public ResponseEntity<Void> register(@RequestBody RegisterRequestDTO registerDTO) {
        service.register(registerDTO);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestHeader("Authorization") String token) {
        service.logout(token);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/{id}/senha")
    public ResponseEntity<Void> updatePassword(@PathVariable Long id, @RequestBody AtualizarSenhaRequestDTO atualizarSenhaDTO) {
        usuarioService.updatePassword(id, atualizarSenhaDTO);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
