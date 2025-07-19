package com.portal_do_aluno.handlers;

import java.util.Date;

public class RestErrorResponse {
    private Date timestamp;
    private String message;
    private String details;

    public RestErrorResponse(Date timestamp, String message, String details) {
        this.timestamp = timestamp;
        this.message = message;
        this.details = details;
    }

    // Getters
    public Date getTimestamp() {
        return timestamp;
    }

    public String getMessage() {
        return message;
    }

    public String getDetails() {
        return details;
    }
}