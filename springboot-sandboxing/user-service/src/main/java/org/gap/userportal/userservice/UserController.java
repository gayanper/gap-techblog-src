package org.gap.userportal.userservice;

import java.util.List;

import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

@Controller
public class UserController {
    @QueryMapping
    public User user(@Argument String id) {
        return new User(id, "Example Name", "example@gmail.com");
    }

    @QueryMapping
    public List<User> users() {
        return List.of(new User("1", "Example Name 1", "example1@gmail.com"), new User("2", "Example Name 2", "example2@gmail.com"));
    }
}
