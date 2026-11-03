package com.urbantravel.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.urbantravel.model.UserPrefs;
import com.urbantravel.model.entity.User;
import com.urbantravel.model.enums.Role;
import com.urbantravel.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public UserService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public User register(String username, String password, String email, String preferencesJson) {
        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("用户名已存在");
        }
        User user = new User();
        user.setUsername(username);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setEmail(email);
        user.setRole(Role.USER);
        // 校验/规范化偏好 JSON
        if (preferencesJson != null && !preferencesJson.trim().isEmpty()) {
            try {
                objectMapper.readTree(preferencesJson);
                user.setPreferences(preferencesJson);
            } catch (Exception e) {
                throw new IllegalArgumentException("偏好格式不合法（需为 JSON）");
            }
        } else {
            try {
                user.setPreferences(objectMapper.writeValueAsString(new UserPrefs()));
            } catch (Exception ignored) {}
        }
        return userRepository.save(user);
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Transactional
    public User updatePreferences(Long userId, String preferencesJson) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("用户不存在"));
        try {
            objectMapper.readTree(preferencesJson);
        } catch (Exception e) {
            throw new IllegalArgumentException("偏好格式不合法（需为 JSON）");
        }
        user.setPreferences(preferencesJson);
        return userRepository.save(user);
    }

    public UserPrefs defaultPrefs() {
        return new UserPrefs();
    }
}
