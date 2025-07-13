package com.portal_do_aluno.exceptions; // Pacote sugerido para seus handlers

import com.portal_do_aluno.exceptions.InvalidDateRangeException;
import com.portal_do_aluno.exceptions.TurmaEncerradaException;
import com.portal_do_aluno.exceptions.VagasInsuficientesException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice // Esta anotação faz com que esta classe "aconselhe" todos os controladores
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField(); // Obtém o nome do campo que falhou
            String errorMessage = error.getDefaultMessage();    // Obtém a mensagem de erro da anotação
            errors.put(fieldName, errorMessage);
        });
        return ResponseEntity.badRequest().body(errors);
    }

    @ExceptionHandler(InvalidDateRangeException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<String> handleInvalidDateRangeException(InvalidDateRangeException ex) {
        return ResponseEntity.badRequest().body(ex.getMessage());
    }

    @ExceptionHandler(TurmaEncerradaException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<String> handleTurmaEncerradaException(TurmaEncerradaException ex) {
        return ResponseEntity.badRequest().body(ex.getMessage());
    }

    @ExceptionHandler(VagasInsuficientesException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<String> handleVagasInsuficientesException(VagasInsuficientesException ex) {
        return ResponseEntity.badRequest().body(ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseEntity<String> handleAllUncaughtExceptions(Exception ex) {
        // Loga a exceção completa para depuração no servidor
        System.err.println("Ocorreu um erro interno não tratado: " + ex.getMessage());
        ex.printStackTrace(); // Imprime o stack trace completo no console do servidor

        // Retorna uma mensagem genérica para o cliente por segurança
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Ocorreu um erro inesperado no servidor. Por favor, tente novamente mais tarde.");
    }
}
