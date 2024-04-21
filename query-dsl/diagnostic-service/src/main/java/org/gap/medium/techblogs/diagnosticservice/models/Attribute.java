package org.gap.medium.techblogs.diagnosticservice.models;

import com.fasterxml.jackson.annotation.JsonAlias;

@SuppressWarnings("java:S115")
public enum Attribute {
    @JsonAlias("ageAtDiagnose")
    AGE_AT_DIAGNOSE, @JsonAlias("cityPopulation")
    CITY_POPULATION, @JsonAlias("code")
    DIAGNOSIS_CODE, @JsonAlias("gender")
    GENDER, @JsonAlias("married")
    MARRIED, @JsonAlias("birthYear")
    BIRTH_YEAR, @JsonAlias("registeredDate")
    REGISTRATION_DATE, @JsonAlias("city")
    CITY_OF_RESIDENCE;
}