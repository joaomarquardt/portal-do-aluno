package com.portal_do_aluno.controllers;

import com.portal_do_aluno.domain.Media;
import com.portal_do_aluno.dtos.MediaDTO;
import com.portal_do_aluno.services.MediaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/medias")
public class MediaController {
    @Autowired
    private MediaService service;

    @GetMapping
    public ResponseEntity<List<MediaDTO>> findAll() {
        List<MediaDTO> mediasDTO = service.findAll();
        return new ResponseEntity<>(mediasDTO, HttpStatus.OK);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<MediaDTO> findById(@PathVariable(value = "id") Long id) {
        MediaDTO mediaDTO = service.findById(id);
        return new ResponseEntity<>(mediaDTO, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<MediaDTO> create(@RequestBody MediaDTO mediaDTO) {
        MediaDTO mediaCriadoDTO = service.create(mediaDTO);
        return new ResponseEntity<>(mediaCriadoDTO, HttpStatus.CREATED);
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<MediaDTO> update(@PathVariable(value = "id") Long id, @RequestBody MediaDTO mediaDTO) {
        MediaDTO mediaAtualizadoDTO = service.update(id, mediaDTO);
        return new ResponseEntity<>(mediaAtualizadoDTO, HttpStatus.OK);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> delete(@PathVariable(value = "id") Long id) {
        service.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
