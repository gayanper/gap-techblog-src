package org.gap.userportal.userservice.lambda;

import org.springframework.web.servlet.function.ServerRequest;
import org.springframework.web.servlet.function.ServerResponse;

public interface HandlerProxy {
    ServerResponse handleRequest(ServerRequest input) throws Exception;

    static HandlerProxy create(LambdaMethod method) {
        return (input) -> {
            try {
                var result = method.methodHandle().invokeWithArguments(input.body(method.requestBodyTyoe()), null);
                return ServerResponse.ok().body(result);
            } catch (Throwable e) {
                throw new Exception(e);
            }
        };
    }
}
