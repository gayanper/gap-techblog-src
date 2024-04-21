package org.gap.medium.techblogs.diagnosticservice.models;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.quarkus.runtime.annotations.RegisterForReflection;

@RegisterForReflection
public final record NotEqualQuery(@JsonProperty("not_equals") EqualityExpr neq) implements Query {
    
}
