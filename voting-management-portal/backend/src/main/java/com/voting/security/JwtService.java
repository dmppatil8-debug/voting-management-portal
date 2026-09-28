package com.voting.security;
import io.jsonwebtoken.*; import io.jsonwebtoken.security.Keys; import org.springframework.beans.factory.annotation.Value; import org.springframework.stereotype.Service;
import javax.crypto.SecretKey; import java.nio.charset.StandardCharsets; import java.util.Date;
@Service
public class JwtService {
 @Value("${app.jwt.secret}") private String secret;
 @Value("${app.jwt.expiration-ms}") private long expiration;
 private SecretKey key(){ return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8)); }
 public String generate(String email, String role){ return Jwts.builder().subject(email).claim("role", role).issuedAt(new Date()).expiration(new Date(System.currentTimeMillis()+expiration)).signWith(key()).compact(); }
 public String extractEmail(String token){ return Jwts.parser().verifyWith(key()).build().parseSignedClaims(token).getPayload().getSubject(); }
public String extractRole(String token){ return Jwts.parser().verifyWith(key()).build().parseSignedClaims(token).getPayload().get("role", String.class); }
}


