package org.gap.medium.techblogs.drugcatalog.domain.model.errors;

public class BusinessValidationException extends Exception {
    public BusinessValidationException(String reason) {
        super(reason);
    }
}
