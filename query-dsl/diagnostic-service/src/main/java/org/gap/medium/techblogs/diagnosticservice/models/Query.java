package org.gap.medium.techblogs.diagnosticservice.models;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.JsonTypeInfo.As;
import com.fasterxml.jackson.annotation.JsonTypeInfo.Id;

@JsonTypeInfo(use = Id.DEDUCTION, include = As.PROPERTY, property = "match_any,match_all,eq,neq,range")
@JsonSubTypes(value = { @JsonSubTypes.Type(name = "match_any", value = MatchAnyQuery.class),
                @JsonSubTypes.Type(name = "match_all", value = MatchAllQuery.class),
                @JsonSubTypes.Type(name = "equals", value = EqualQuery.class),
                @JsonSubTypes.Type(name = "not_equals", value = NotEqualQuery.class),
                @JsonSubTypes.Type(name = "range", value = RangeQuery.class) })
public sealed interface Query permits MatchAnyQuery, MatchAllQuery, EqualQuery, NotEqualQuery, RangeQuery {
        
}
