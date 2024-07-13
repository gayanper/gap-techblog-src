package org.gap.medium.techblogs.drugcatalog.adapters.rest.schemas;

import com.fasterxml.jackson.annotation.JsonProperty;

public record Drug(String id, Names names, Manufacturer manufacturer, Dosage dosage) {
    
    public record Names(String genericName, String brandName) {
    }
    
    public record Manufacturer(String name, String contactInfo) {
    }
    
    public record Dosage(DosageForm form, String strength) {
    }
    
    public enum DosageForm {
        @JsonProperty("Tablet")
        TABLET, @JsonProperty("Capsule")
        CAPSULE, @JsonProperty("Infusion")
        INFUSION, @JsonProperty("Liquid")
        LIQUID;
    }
}
