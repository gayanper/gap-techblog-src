package org.gap.medium.techblogs.diagnosticservice.models;

import java.util.Set;

import io.quarkus.runtime.annotations.RegisterForReflection;

@RegisterForReflection
public record Range(Attribute attribute, Set<RangeOp> values) {
    
}
