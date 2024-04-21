package org.gap.medium.techblogs.diagnosticservice.models;

import java.time.LocalDate;

import io.quarkus.runtime.annotations.RegisterForReflection;

@RegisterForReflection
public record DiagnosisEntry(String code, LocalDate registeredDate, int ageAtDiagnose, int birthYear, Gender gender,
                boolean married, DemographicData demographicData) {
        
}
