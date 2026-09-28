
package com.voting.config;

import com.voting.security.JwtFilter;
import org.springframework.context.annotation.*;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.*;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.*;
import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    SecurityFilterChain security(HttpSecurity http, JwtFilter jwt) throws Exception {

        http.csrf(c -> c.disable())
            .cors(c -> c.configurationSource(cors()))
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(a -> a

                .requestMatchers(
                    "/api/auth/**"
                ).permitAll()

                .requestMatchers(
                    HttpMethod.POST,
                    "/api/elections"
                ).hasRole("ADMIN")

                .requestMatchers(
                    HttpMethod.PUT,
                    "/api/elections/**"
                ).hasRole("ADMIN")

                .requestMatchers(
                    HttpMethod.GET,
                    "/api/elections",
                    "/api/elections/**"
                ).permitAll()

                .requestMatchers(
                    "/api/results/**"
                ).permitAll()

                .requestMatchers(
                    HttpMethod.GET,
                    "/api/candidates/election/**"
                ).permitAll()

                .requestMatchers(
                    HttpMethod.POST,
                    "/api/candidates"
                ).hasRole("ADMIN")

                .requestMatchers(
                    HttpMethod.DELETE,
                    "/api/candidates/**"
                ).hasRole("ADMIN")

                .requestMatchers(
                    "/api/votes/**"
                ).hasRole("VOTER")

                .anyRequest().authenticated()
            )
            .addFilterBefore(jwt, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    CorsConfigurationSource cors() {

        CorsConfiguration c = new CorsConfiguration();

        c.setAllowedOrigins(List.of("http://localhost:5173"));
        c.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        c.setAllowedHeaders(List.of("*"));
        c.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource s =
                new UrlBasedCorsConfigurationSource();

        s.registerCorsConfiguration("/**", c);

        return s;
    }
}

