package com.portal_do_aluno.handlers;

import com.portal_do_aluno.exceptions.InvalidDateRangeException;
import com.portal_do_aluno.security.exceptions.RegisterConflictException;
import com.portal_do_aluno.exceptions.TurmaEncerradaException;
import com.portal_do_aluno.exceptions.VagasInsuficientesException;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.WebRequest;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@ControllerAdvice
@RestController
public class RestExceptionHandler {

    // Tratamento para Validações do Spring (@Valid)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public final ResponseEntity<RestErrorResponse> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex, WebRequest request) {
        List<String> errors = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.toList());

        RestErrorResponse errorResponse = new RestErrorResponse(
                new Date(),
                "Erro de Validação",
                String.join(", ", errors));

        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    // Tratamento para quando uma entidade não é encontrada
    @ExceptionHandler(EntityNotFoundException.class)
    public final ResponseEntity<RestErrorResponse> handleEntityNotFoundException(EntityNotFoundException ex, WebRequest request) {
        RestErrorResponse errorResponse = new RestErrorResponse(
                new Date(),
                ex.getMessage(),
                request.getDescription(false));
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }

    // Tratamento para conflitos de dados, como CPF ou e-mail já existentes
    @ExceptionHandler(RegisterConflictException.class)
    public final ResponseEntity<RestErrorResponse> handleRegisterConflictException(RegisterConflictException ex, WebRequest request) {
        RestErrorResponse errorResponse = new RestErrorResponse(
                new Date(),
                "Conflito de dados",
                ex.getMessage());
        return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
    }

    // Tratamento para violações de integridade do banco de dados (ex: chaves únicas)
    @ExceptionHandler(DataIntegrityViolationException.class)
    public final ResponseEntity<RestErrorResponse> handleDataIntegrityViolationException(DataIntegrityViolationException ex, WebRequest request) {
        RestErrorResponse errorResponse = new RestErrorResponse(
                new Date(),
                "Violação de Integridade de Dados",
                "Já existe um registro com os dados informados. Verifique se o CPF, e-mail ou outro campo único já está cadastrado.");
        return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
    }

    // Tratamento para credenciais inválidas no login
    @ExceptionHandler(BadCredentialsException.class)
    public final ResponseEntity<RestErrorResponse> handleBadCredentialsException(BadCredentialsException ex, WebRequest request) {
        RestErrorResponse errorResponse = new RestErrorResponse(
                new Date(),
                "Credenciais inválidas",
                ex.getMessage());
        return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
    }

    // Tratamento para acesso negado (Spring Security)
    @ExceptionHandler(AccessDeniedException.class)
    public final ResponseEntity<RestErrorResponse> handleAccessDeniedException(AccessDeniedException ex, WebRequest request) {
        RestErrorResponse errorResponse = new RestErrorResponse(
                new Date(),
                "Acesso Negado",
                "Você não tem permissão para acessar este recurso.");
        return new ResponseEntity<>(errorResponse, HttpStatus.FORBIDDEN);
    }

    // Tratamento para exceções de negócio específicas
    @ExceptionHandler({VagasInsuficientesException.class, TurmaEncerradaException.class, InvalidDateRangeException.class, IllegalArgumentException.class})
    public final ResponseEntity<RestErrorResponse> handleBusinessExceptions(RuntimeException ex, WebRequest request) {
        RestErrorResponse errorResponse = new RestErrorResponse(
                new Date(),
                "Regra de Negócio Violada",
                ex.getMessage());
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    // Tratamento genérico para outras exceções não capturadas
    @ExceptionHandler(Exception.class)
    public final ResponseEntity<RestErrorResponse> handleAllExceptions(Exception ex, WebRequest request) {
        RestErrorResponse errorResponse = new RestErrorResponse(
                new Date(),
                "Erro inesperado no servidor",
                ex.getMessage());
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}