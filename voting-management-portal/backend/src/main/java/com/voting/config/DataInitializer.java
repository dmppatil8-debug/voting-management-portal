package com.voting.config;

import com.voting.entity.Role;
import com.voting.entity.User;
import com.voting.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner admin(UserRepository repo, PasswordEncoder encoder) {
        return args -> {
            if (!repo.existsByEmail("admin@voting.local")) {
                User u = new User();
                u.setName("System Admin");
                u.setEmail("admin@voting.local");
                u.setPassword(encoder.encode("admin123"));
                u.setRole(Role.ADMIN);
                repo.save(u);
            }
        };
    }
}