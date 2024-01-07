package org.gap.medium.contracttesting;

import java.math.BigDecimal;
import java.util.List;

public record Item(String code, String description, BigDecimal price, List<BigDecimal> prices) {
}
