
package org.gap.medium.contracttesting;

import java.text.NumberFormat;
import java.util.Locale;
import java.util.logging.Logger;

import io.helidon.config.Config;
import io.helidon.logging.common.LogConfig;
import io.helidon.webserver.WebServer;
import io.helidon.webserver.http.HttpRouting;
import io.helidon.webserver.observe.ObserveFeature;

/**
 * The application main class.
 */
public class Main {
    private static final Logger LOGGER = Logger.getLogger(Main.class.getName());
    
    private Main() {
    }
    
    public static void main(String[] args) {
        LogConfig.configureRuntime();
        
        Config config = Config.create();
        Config.global(config);
        
        ObserveFeature observe = ObserveFeature.builder().config(config.get("server.features.observe")).build();
        WebServer server = WebServer.builder().config(config.get("server")).addFeature(observe).routing(
                Main::routing).build().start();
        LOGGER.info(() -> "WEB server is up! http://localhost:%s/".formatted(server.port()));
    }
    
    static void routing(HttpRouting.Builder routing) {
        routing.register(new ItemService(new ItemRepository(), NumberFormat.getInstance(Locale.US)));
    }
}