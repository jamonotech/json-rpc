package m1.uasz.sn.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.context.annotation.Bean;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf().disable() // désactive CSRF pour faciliter les tests POST
                .authorizeHttpRequests()
                .requestMatchers("/jsonrpc/person").permitAll() // autorise cet endpoint
                .anyRequest().authenticated(); // le reste nécessite auth
        return http.build();
    }
}
