package org.gap.java.build;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.testcontainers.containers.GenericContainer;

public class TestcontainersTest {
    private GenericContainer genericContainer;

    @BeforeAll
    public void setup() {
        genericContainer = new GenericContainer("alpine").withCommand("echo");
        genericContainer.start();
    }

    @AfterAll
    public void cleanup() {
        genericContainer.stop();
    }
}
