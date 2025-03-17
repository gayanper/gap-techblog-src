package org.gap.userportal.userservice.lambda;

import java.lang.invoke.MethodHandle;

public record LambdaMethod(MethodHandle methodHandle, Class<?> requestBodyTyoe, Class<?> responseBodyType) {

}