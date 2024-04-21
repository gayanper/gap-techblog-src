package org.gap.medium.techblogs.diagnosticservice.models;

import io.quarkus.runtime.annotations.RegisterForReflection;

@RegisterForReflection
public record DemographicData(String city, int population) {
    
}
