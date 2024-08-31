package org.gap.medium.techblogs.drugcatalog.adapters.rest;

import java.util.List;

import org.gap.medium.techblogs.drugcatalog.adapters.rest.schemas.DrugList;
import org.gap.medium.techblogs.drugcatalog.adapters.rest.schemas.DrugSearch;
import org.gap.medium.techblogs.drugcatalog.domain.model.errors.BusinessValidationException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.constraints.NotNull;

@RestController
@RequestMapping(path = "/drugs")
public class DrugsController {
    
    @PostMapping(path = "search", consumes = "application/json", produces = "application/json")
    public @NotNull DrugList search(@RequestBody @NotNull DrugSearch request)
            throws BusinessValidationException, RuntimeException {
        return new DrugList(List.of());
    }
}
