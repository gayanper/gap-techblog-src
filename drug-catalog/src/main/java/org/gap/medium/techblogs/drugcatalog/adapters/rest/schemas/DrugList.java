package org.gap.medium.techblogs.drugcatalog.adapters.rest.schemas;

import java.util.List;

import jakarta.validation.constraints.NotNull;

public record DrugList(@NotNull List<Drug> drugs) {
    
}
