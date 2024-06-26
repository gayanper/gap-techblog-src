package org.gap.java.build.rules;

import org.junit.jupiter.api.Test;

import com.google.errorprone.CompilationTestHelper;

class KubedocNetworkAliasCheckTest {
    CompilationTestHelper helper = CompilationTestHelper.newInstance(KubedocNetworkAliasCheck.class, getClass());

    @Test
    void whenCreatedWithGenericContainerBuilderWithNetworkAliases() {
        helper.addSourceLines("GenericContainerCreation.java", """
                import org.testcontainers.containers.GenericContainer;
                public class GenericContainerCreation {
                    public void setup() {
                        GenericContainer<?> genericContainer = new GenericContainer<>("alpine").withCommand("echo");
                        genericContainer.withNetworkAliases("k3s").withLabel("app", "echo");
                        genericContainer.start();
                    }
                }
                """.split("\n")).doTest();
    }

    @Test
    void whenCreatedWithGenericContainerBuilderWithNoNetworkAliases() {
        helper.addSourceLines("GenericContainerCreation.java", """
                import org.testcontainers.containers.GenericContainer;
                public class GenericContainerCreation {
                    // BUG: Diagnostic contains: The method setup must include a network alias on the testcontainers.
                    public void setup() {
                        GenericContainer<?> genericContainer = new GenericContainer<>("alpine").withCommand("echo");
                        genericContainer.withLabel("app", "echo");
                        genericContainer.start();
                    }
                }
                """.split("\n")).doTest();
    }

    @Test
    void whenCreatedWithGenericContainerBuilderWithNoNetworkAliases_FieldVariant() {
        helper.addSourceLines("GenericContainerCreation.java", """
                import org.testcontainers.containers.GenericContainer;
                public class GenericContainerCreation {
                    private GenericContainer<?> genericContainer;
                    // BUG: Diagnostic contains: The method setup must include a network alias on the testcontainers.
                    public void setup() {
                        genericContainer = new GenericContainer<>("alpine").withCommand("echo");
                        genericContainer.start();
                    }
                }
                """.split("\n")).doTest();
    }

    @Test
    void whenNoTestContainersUsed() {
        helper.addSourceLines("GenericContainerCreation.java", """
                import org.testcontainers.containers.GenericContainer;
                public class GenericContainerCreation {
                    public void setup() {
                        // no testcontainers used
                    }
                }
                """.split("\n")).doTest();
    }
}
