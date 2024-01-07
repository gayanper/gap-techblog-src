package org.gap.medium.contracttesting;

import java.text.NumberFormat;
import java.util.List;

import io.helidon.webserver.http.HttpRules;
import io.helidon.webserver.http.HttpService;
import io.helidon.webserver.http.ServerRequest;
import io.helidon.webserver.http.ServerResponse;

public class ItemService implements HttpService {
    private ItemRepository repository;
    private NumberFormat format;
    
    public ItemService(ItemRepository repository, NumberFormat format) {
        this.repository = repository;
        this.format = format;
    }
    
    @Override
    public void routing(HttpRules rules) {
        rules.get("/items", this::list);
    }
    
    private void list(ServerRequest request, ServerResponse response) {
        final List<ItemResponse> responseItems = repository.listAll().stream().map(this::mapToResponse).toList();
        response.header("Content-Type", "application/json");
        response.status(200);
        response.send(responseItems);
    }
    
    private ItemResponse mapToResponse(Item item) {
        return new ItemResponse(item.code(), item.description(), format.format(item.price()),
                item.prices().stream().map(format::format).toList());
    }
}
