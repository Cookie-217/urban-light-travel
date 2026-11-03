package com.urbantravel.model.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class AuthDto {

    public static class AuthRequest {
        @NotBlank public String username;
        @NotBlank public String password;
    }

    public static class RegisterRequest {
        @NotBlank @Size(min = 3, max = 32) public String username;
        @NotBlank @Size(min = 6, max = 64) public String password;
        public String email;
        public String preferences;
    }

    public static class AuthResponse {
        public String token;
        public String username;
        public String role;
        public UserInfo user;

        public AuthResponse() {}
        public AuthResponse(String token, String username, String role, UserInfo user) {
            this.token = token; this.username = username; this.role = role; this.user = user;
        }
    }

    public static class UserInfo {
        public Long id;
        public String username;
        public String email;
        public String role;
        public String preferences;
        public java.time.LocalDateTime createdAt;

        public UserInfo() {}
        public UserInfo(Long id, String username, String email, String role, String preferences, java.time.LocalDateTime createdAt) {
            this.id = id; this.username = username; this.email = email;
            this.role = role; this.preferences = preferences; this.createdAt = createdAt;
        }
    }
}
