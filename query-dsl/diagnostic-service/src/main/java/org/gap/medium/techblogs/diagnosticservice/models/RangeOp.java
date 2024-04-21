package org.gap.medium.techblogs.diagnosticservice.models;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.JsonTypeInfo.As;
import com.fasterxml.jackson.annotation.JsonTypeInfo.Id;

@JsonTypeInfo(use = Id.DEDUCTION, include = As.PROPERTY, property = "gt,lt")
@JsonSubTypes(value = { @JsonSubTypes.Type(name = "lt", value = LessThan.class),
        @JsonSubTypes.Type(name = "gt", value = GreaterThan.class) })
public sealed interface RangeOp permits LessThan, GreaterThan {
    
}
