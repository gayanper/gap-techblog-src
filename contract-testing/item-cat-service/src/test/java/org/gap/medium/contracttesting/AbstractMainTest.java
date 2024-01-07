package org.gap.medium.contracttesting;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;

import org.junit.jupiter.api.Test;

import io.helidon.http.Status;
import io.helidon.webclient.api.ClientResponseTyped;
import io.helidon.webclient.http1.Http1Client;
import io.helidon.webserver.http.HttpRouting;
import io.helidon.webserver.testing.junit5.SetUpRoute;

abstract class AbstractMainTest {
    private final Http1Client client;
    
    protected AbstractMainTest(Http1Client client) {
        this.client = client;
    }
    
    @SetUpRoute
    static void routing(HttpRouting.Builder builder) {
        Main.routing(builder);
    }
    
    @Test
    void testGreet() {
        ClientResponseTyped<ItemResponse> response = (ClientResponseTyped<ItemResponse>) client.get("/greet").request();
        assertThat(response.status(), is(Status.OK_200));
    }
    
}
