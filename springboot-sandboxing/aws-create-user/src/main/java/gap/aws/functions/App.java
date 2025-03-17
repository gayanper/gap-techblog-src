package gap.aws.functions;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;

import gap.aws.commons.Request;
import gap.aws.commons.Response;

public class App implements RequestHandler<Request, Response> {

    public App() {
    }

    @Override
    public Response handleRequest(final Request input, final Context context) {
        return new Response(input.username());
    }
}
