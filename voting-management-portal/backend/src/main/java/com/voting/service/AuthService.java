package com.voting.service;

import com.voting.entity.*;
import com.voting.repository.UserRepository;
import com.voting.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {


private final UserRepository users;
private final PasswordEncoder encoder;
private final JwtService jwt;

public AuthService(UserRepository users, PasswordEncoder encoder, JwtService jwt) {
    this.users = users;
    this.encoder = encoder;
    this.jwt = jwt;
}

public String register(String name, String email, String password) {
    if (users.existsByEmail(email))
        throw new IllegalArgumentException("Email already registered");

    User u = new User();
    u.setName(name);
    u.setEmail(email.toLowerCase());
    u.setPassword(encoder.encode(password));
    u.setRole(Role.VOTER);
    users.save(u);

    return jwt.generate(u.getEmail(), u.getRole().name());
}

public String login(String email, String password) {
    User u = users.findByEmail(email.toLowerCase())
            .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

    if (!encoder.matches(password, u.getPassword()))
        throw new IllegalArgumentException("Invalid credentials");

    return jwt.generate(u.getEmail(), u.getRole().name());
}


}
