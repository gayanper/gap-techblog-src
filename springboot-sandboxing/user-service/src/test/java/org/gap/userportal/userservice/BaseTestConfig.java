package org.gap.userportal.userservice;

import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;

public abstract class BaseTestConfig {
    
    @SuppressWarnings("resource")
    @Container
    protected static final MySQLContainer<?> mysql = new MySQLContainer<>("mysql:8.0")
        .withDatabaseName("userdb")
        .withUsername("testuser")
        .withPassword("testpass")
        .withReuse(false);
    
    static {
        // Start the container when the class is loaded
        mysql.start();
    }
    
    @DynamicPropertySource
    static void registerMySQLProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", mysql::getJdbcUrl);
        registry.add("spring.datasource.username", mysql::getUsername);
        registry.add("spring.datasource.password", mysql::getPassword);
    }
}
