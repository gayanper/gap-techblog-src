package org.gap.medium.techblogs.drugcatalog.adapters.rest;

import org.gap.medium.techblogs.drugcatalog.domain.model.errors.BusinessValidationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ErrorHandler {
    @ExceptionHandler(BusinessValidationException.class)
    @ResponseStatus(value = HttpStatus.BAD_REQUEST)
    @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ProblemDetail handleBusinessValidationErrors(BusinessValidationException ex) {
        var problem = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
        problem.setDetail(ex.getMessage());
        return problem;
    }
    
    @ExceptionHandler(RuntimeException.class)
    @ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR)
    @RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ProblemDetail handleRuntimeErrors(RuntimeException ex) {
        var problem = ProblemDetail.forStatus(HttpStatus.INTERNAL_SERVER_ERROR);
        problem.setDetail(ex.getMessage());
        return problem;
    }
}
