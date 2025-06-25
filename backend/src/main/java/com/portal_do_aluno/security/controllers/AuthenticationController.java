package com.portal_do_aluno.security.controllers;

import com.portal_do_aluno.security.dtos.requests.AuthRequestDTO;
import com.portal_do_aluno.security.dtos.requests.RegisterRequestDTO;
import com.portal_do_aluno.security.dtos.responses.AuthResponseDTO;
import com.portal_do_aluno.security.services.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {
    @Autowired
    private AuthenticationService service;


    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody AuthRequestDTO authDTO) {
        String token = service.login(authDTO);
        return new ResponseEntity<>(new AuthResponseDTO(token), HttpStatus.OK);
    }

    @PostMapping("/register")
    public ResponseEntity<Void> register(@RequestBody RegisterRequestDTO registerDTO) {
        service.register(registerDTO);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }
}
