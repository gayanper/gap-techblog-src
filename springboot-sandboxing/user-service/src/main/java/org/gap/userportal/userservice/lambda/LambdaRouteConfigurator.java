package org.gap.userportal.userservice.lambda;

import static org.springframework.web.servlet.function.RequestPredicates.POST;
import static org.springframework.web.servlet.function.RouterFunctions.route;

import java.io.File;
import java.lang.invoke.MethodHandles;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Stream;

import org.jboss.modules.LocalModuleLoader;
import org.jboss.modules.Module;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.function.RouterFunction;
import org.springframework.web.servlet.function.ServerResponse;

@Configuration
public class LambdaRouteConfigurator {
    private static final int ROUTE_NAME_OFFSET = "lambda_".length();
    private static Function<String, String> DIR_TO_ROUTE = dirName -> dirName.substring(ROUTE_NAME_OFFSET);

    @Bean
    RouterFunction<ServerResponse> lambdaRoutes() {
        Map<String, HandlerProxy> lambdaHandlers = loadLambdaModules();
        RouterFunction<ServerResponse> router = null;

        for (Map.Entry<String, HandlerProxy> entry : lambdaHandlers.entrySet()) {
            var routeName = entry.getKey();
            var handler = entry.getValue();
            var r = route(POST(routeName),
                    request -> handler.handleRequest(request));
            if (router == null) {
                router = r;
            } else {
                router = router.and(r);
            }
        }
        return router;
    }

    private Map<String, HandlerProxy> loadLambdaModules() {
        Map<String, HandlerProxy> lambdaHandlers = new HashMap<>();
        var path = Paths.get("./modules").toAbsolutePath().toFile();
        try (var moduleLoader = new LocalModuleLoader(new File[] { path })) {
            var modules = moduleLoader.iterateModules((String) null, true);
            modules.forEachRemaining(moduleName -> {
                Module module;
                try {
                    module = moduleLoader.loadModule(moduleName);
                    var routeName = DIR_TO_ROUTE.apply(moduleName);
                    var handlerClassname = module.getProperty("main-class");
                    var handlerClass = module.getClassLoader().loadClass(handlerClassname);
                    var instance = handlerClass.getConstructor().newInstance();
                    var method = Stream.of(handlerClass.getMethods()).filter(m -> m.getName().equals("handleRequest"))
                    .findFirst().get();
                    var mh = MethodHandles.lookup()
                            .unreflect(method).bindTo(instance);
                    var lambdaMethod = new LambdaMethod(mh, method.getParameterTypes()[0],
                            method.getReturnType());
                    lambdaHandlers.put(routeName, HandlerProxy.create(lambdaMethod));
                } catch (Throwable e) {
                    System.err.println("Failed to load module " + moduleName);
                    e.printStackTrace();
                }
            });
        }
        return lambdaHandlers;
    }
}
