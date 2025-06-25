package com.portal_do_aluno.security.exceptions;

public class RegisterConflictException extends RuntimeException {
    public RegisterConflictException(String message) {
        super(message);
    }
}
