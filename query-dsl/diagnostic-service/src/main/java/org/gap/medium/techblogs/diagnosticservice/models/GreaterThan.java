package org.gap.medium.techblogs.diagnosticservice.models;

import io.quarkus.runtime.annotations.RegisterForReflection;

@RegisterForReflection
public final record GreaterThan(RangeValue gt) implements RangeOp {
    
}
