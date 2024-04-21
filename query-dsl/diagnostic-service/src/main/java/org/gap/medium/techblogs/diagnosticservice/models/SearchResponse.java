package org.gap.medium.techblogs.diagnosticservice.models;

import java.util.List;

import io.quarkus.runtime.annotations.RegisterForReflection;

@RegisterForReflection
public record SearchResponse(List<DiagnosisEntry> dataPoints) {
    
}
