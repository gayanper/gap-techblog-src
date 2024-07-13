package org.gap.medium.techblogs.drugcatalog.adapters.rest.schemas;

import jakarta.validation.constraints.NotNull;

public record DrugSearch(@NotNull String genericName) {
    
}
