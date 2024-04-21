package org.gap.medium.techblogs.diagnosticservice;

import org.gap.medium.techblogs.diagnosticservice.data.DiagnosticsRepository;
import org.gap.medium.techblogs.diagnosticservice.models.Query;
import org.gap.medium.techblogs.diagnosticservice.models.SearchResponse;
import org.gap.medium.techblogs.diagnosticservice.parser.MongoGenerator;
import org.gap.medium.techblogs.diagnosticservice.parser.QueryParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("/diagnosis")
@ApplicationScoped
public class StatisticAPI {
    private static final Logger LOGGER = LoggerFactory.getLogger(StatisticAPI.class);
    private QueryParser parser;
    private DiagnosticsRepository repository;
    
    public StatisticAPI(QueryParser parser, DiagnosticsRepository repository) {
        this.parser = parser;
        this.repository = repository;
    }
    
    @Path("/search")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    @POST
    public SearchResponse search(Query query) {
        var mongoQuery = parser.parse(query, new MongoGenerator());
        var entries = repository.find(mongoQuery);
        
        LOGGER.debug("{} entries found", entries.size());
        return new SearchResponse(entries);
    }
}
