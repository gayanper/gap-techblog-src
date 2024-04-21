package org.gap.medium.techblogs.diagnosticservice.models;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.quarkus.runtime.annotations.RegisterForReflection;

@RegisterForReflection
public final record MatchAllQuery(@JsonProperty("match_all") List<Query> matchAll) implements Query {
    
}
