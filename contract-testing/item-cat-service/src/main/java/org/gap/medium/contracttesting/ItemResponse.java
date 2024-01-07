package org.gap.medium.contracttesting;

import java.util.List;

public record ItemResponse(String code, String description, List<String> price) {
}
