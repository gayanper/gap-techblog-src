package org.gap.techblogs.esshards.api;

import java.util.concurrent.CompletableFuture;

import org.gap.techblogs.esshards.repo.EmployeesRepo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.inject.Inject;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;

@Path("/shards")
public class ShardsResource {
    private static final Logger LOG = LoggerFactory.getLogger(ShardsResource.class);

    private EmployeesRepo repo;
    private Indexer indexer;

    @Inject
    public ShardsResource(EmployeesRepo repo, Indexer indexer) {
        this.repo = repo;
        this.indexer = indexer;
    }

    @POST
    @Path("/index")
    public void index(@PathParam("size") int sizeToIndex) {
        CompletableFuture.runAsync(() -> indexer.index(repo.loadAll(sizeToIndex))).whenComplete((v, err) -> {
            if (err != null) {
                LOG.error("Failed to index", err);
            }
        });
    }
}
