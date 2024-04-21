package org.gap.medium.techblogs.diagnosticservice.models;

import io.quarkus.runtime.annotations.RegisterForReflection;

@RegisterForReflection
public record EqualityExpr(Attribute attribute, Object value) {
    
}
