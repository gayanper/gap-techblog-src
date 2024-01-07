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
        items.add(new Item("T9090", "Milk 3.5% 1L", new BigDecimal("10.5")));
        items.add(new Item("T9091", "Bread", new BigDecimal("5.5")));
        items.add(new Item("T9092", "Butter", new BigDecimal("15.5")));
        items.add(new Item("T9093", "Cheese", new BigDecimal("20.5")));
        items.add(new Item("T9094", "Eggs", new BigDecimal("25.5")));
        items.add(new Item("T9095", "Yogurt", new BigDecimal("30.5")));
        items.add(new Item("T9096", "Ice Cream", new BigDecimal("35.5")));
        items.add(new Item("T9097", "Chocolate", new BigDecimal("40.5")));
        items.add(new Item("T9098", "Candy", new BigDecimal("45.5")));
        items.add(new Item("T9099", "Cake", new BigDecimal("50.5")));
        items.add(new Item("T9100", "Cookies", new BigDecimal("55.5")));
        items.add(new Item("T9101", "Pasta", new BigDecimal("60.5")));
        items.add(new Item("T9102", "Rice", new BigDecimal("65.5")));
        items.add(new Item("T9103", "Potato", new BigDecimal("70.5")));
        items.add(new Item("T9104", "Tomato", new BigDecimal("75.5")));
        items.add(new Item("T9105", "Onion", new BigDecimal("80.5")));
        items.add(new Item("T9106", "Garlic", new BigDecimal("85.5")));
        items.add(new Item("T9107", "Carrot", new BigDecimal("90.5")));
        items.add(new Item("T9108", "Cucumber", new BigDecimal("95.5")));
    }
    
    public List<Item> listAll() {
        return List.copyOf(items);
    }
}
