package org.gap.medium.contracttesting;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class ItemRepository {
    private List<Item> items = new ArrayList<>();
    
    public ItemRepository() {
        initFakeData();
    }
    
    private void initFakeData() {
        items.add(new Item("T9090", "Milk 3.5% 1L", List.of(new BigDecimal("10.5"))));
        items.add(new Item("T9091", "Bread", List.of(new BigDecimal("5.5"))));
        items.add(new Item("T9092", "Butter", List.of(new BigDecimal("15.5"))));
        items.add(new Item("T9093", "Cheese", List.of(new BigDecimal("20.5"))));
        items.add(new Item("T9094", "Eggs", List.of(new BigDecimal("25.5"))));
        items.add(new Item("T9095", "Yogurt", List.of(new BigDecimal("30.5"))));
        items.add(new Item("T9096", "Ice Cream", List.of(new BigDecimal("35.5"))));
        items.add(new Item("T9097", "Chocolate", List.of(new BigDecimal("40.5"))));
        items.add(new Item("T9098", "Candy", List.of(new BigDecimal("45.5"))));
        items.add(new Item("T9099", "Cake", List.of(new BigDecimal("50.5"))));
        items.add(new Item("T9100", "Cookies", List.of(new BigDecimal("55.5"))));
        items.add(new Item("T9101", "Pasta", List.of(new BigDecimal("60.5"))));
        items.add(new Item("T9102", "Rice", List.of(new BigDecimal("65.5"))));
        items.add(new Item("T9103", "Potato", List.of(new BigDecimal("70.5"))));
        items.add(new Item("T9104", "Tomato", List.of(new BigDecimal("75.5"))));
        items.add(new Item("T9105", "Onion", List.of(new BigDecimal("80.5"))));
        items.add(new Item("T9106", "Garlic", List.of(new BigDecimal("85.5"))));
        items.add(new Item("T9107", "Carrot", List.of(new BigDecimal("90.5"))));
        items.add(new Item("T9108", "Cucumber", List.of(new BigDecimal("95.5"))));
    }
    
    public List<Item> listAll() {
        return List.copyOf(items);
    }
}
