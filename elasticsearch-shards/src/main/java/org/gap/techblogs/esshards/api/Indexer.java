package org.gap.techblogs.esshards.api;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.ElasticsearchException;
import co.elastic.clients.elasticsearch.core.BulkResponse;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

@ApplicationScoped
public class Indexer {
  private static final String SHARD_COUNT = "3";
  private static final String INDEX_NAME = "employees";
  private static final int BATCH_SIZE = 500;
  private static final Logger LOGGER = LoggerFactory.getLogger(Indexer.class);

  private ElasticsearchClient client;

  @Inject
  public Indexer(ElasticsearchClient client) {
    this.client = client;
  }

  public void index(List<Map<String, Object>> employees) {
    try {
      LOGGER.info("Creating index mapping");
      createIndexMapping();

      LOGGER.info("Indexing {} employees", employees.size());
      if (BATCH_SIZE > employees.size()) {
        writeToIndex(employees);
      } else {
        for (int batchNum = 0; (batchNum * BATCH_SIZE) < employees.size(); batchNum++) {
          var batch =
              employees.subList(
                  batchNum * BATCH_SIZE, Math.min((batchNum + 1) * BATCH_SIZE, employees.size()));
          LOGGER.info("Indexing batch {} of size {}", batchNum, batch.size());
          writeToIndex(batch);
        }
      }
      LOGGER.info("Indexing complete");
      client.indices().refresh(r -> r.index(INDEX_NAME));

    } catch (ElasticsearchException | IOException e) {
      throw new RuntimeException(e);
    }
  }

  private void writeToIndex(List<Map<String, Object>> batch)
      throws ElasticsearchException, IOException {
    BulkResponse resp =
        client.bulk(
            b -> {
              for (Map<String, Object> employee : batch) {
                b.index(INDEX_NAME)
                    .operations(
                        op ->
                            op.index(
                                idx ->
                                    idx.id(employee.get("empNo").toString()).document(employee)));
              }
              return b;
            });
    if (resp.errors()) {
      LOGGER.error("Error indexing batch: {}", resp.items().stream().map(i -> i.error()).toList());
      throw new RuntimeException("Error indexing batch");
    }
  }

  private void createIndexMapping() throws ElasticsearchException, IOException {
    if (client.indices().exists(r -> r.index(INDEX_NAME)).value()) {
      LOGGER.info("Index already exists, Deleting index");
      client.indices().delete(r -> r.index(INDEX_NAME));
    }
    client
        .indices()
        .create(
            i ->
                i.settings(s -> s.numberOfShards(SHARD_COUNT).numberOfReplicas(SHARD_COUNT))
                    .mappings(
                        m -> {
                          m.properties("EmpNo", p -> p.text(t -> t));
                          m.properties("firstName", p -> p.text(t -> t));
                          m.properties("lastName", p -> p.text(t -> t));
                          m.properties("gender", p -> p.text(t -> t));
                          m.properties("hireDate", p -> p.date(d -> d));
                          m.properties("birthDate", p -> p.date(d -> d));
                          return m;
                        }).index(INDEX_NAME));
  }
}
