package com.urbantravel.controller;

import com.urbantravel.model.dto.AuthDto.AuthRequest;
import com.urbantravel.model.dto.AuthDto.AuthResponse;
import com.urbantravel.model.dto.AuthDto.RegisterRequest;
import com.urbantravel.model.dto.AuthDto.UserInfo;
import com.urbantravel.model.entity.User;
import com.urbantravel.repository.UserRepository;
import com.urbantravel.security.CurrentUserService;
import com.urbantravel.security.JwtUtil;
import com.urbantravel.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public AuthController(AuthenticationManager authenticationManager, UserService userService,
                          JwtUtil jwtUtil, UserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest req) {
        User user = userService.register(req.username, req.password, req.email, req.preferences);
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
        return ResponseEntity.ok(new AuthResponse(token, user.getUsername(), user.getRole().name(),
                toInfo(user)));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest req) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.username, req.password));
        } catch (BadCredentialsException e) {
            throw e;
        }
        User user = userRepository.findByUsername(req.username)
                .orElseThrow(() -> new BadCredentialsException("用户不存在"));
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
        return ResponseEntity.ok(new AuthResponse(token, user.getUsername(), user.getRole().name(),
                toInfo(user)));
    }

    private UserInfo toInfo(User u) {
        return new UserInfo(u.getId(), u.getUsername(), u.getEmail(), u.getRole().name(),
                u.getPreferences(), u.getCreatedAt());
    }
}
