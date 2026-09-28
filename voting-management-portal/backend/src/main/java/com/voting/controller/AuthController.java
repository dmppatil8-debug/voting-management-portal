package com.voting.controller;
import com.voting.service.AuthService; import jakarta.validation.Valid; import jakarta.validation.constraints.*; import org.springframework.http.ResponseEntity; import org.springframework.web.bind.annotation.*; import java.util.Map;
@RestController @RequestMapping("/api/auth")
public class AuthController { private final AuthService auth; public AuthController(AuthService auth){this.auth=auth;}
 public record AuthRequest(@Email @NotBlank String email,@NotBlank String password){} public record RegisterRequest(@NotBlank String name,@Email @NotBlank String email,@Size(min=6) String password){}
 @PostMapping("/register") ResponseEntity<?> register(@Valid @RequestBody RegisterRequest r){return ResponseEntity.ok(Map.of("token",auth.register(r.name(),r.email(),r.password())));}
 @PostMapping("/login") ResponseEntity<?> login(@Valid @RequestBody AuthRequest r){return ResponseEntity.ok(Map.of("token",auth.login(r.email(),r.password())));}
}
