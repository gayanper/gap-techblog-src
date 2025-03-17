package org.gap.userportal.userservice;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.testcontainers.junit.jupiter.Testcontainers;

@SpringBootTest
@Testcontainers
class UserServiceApplicationTests extends BaseTestConfig {

	@Test
	void contextLoads() {
		// This will verify that the application context loads successfully
		// with the MySQL container running
	}
}
