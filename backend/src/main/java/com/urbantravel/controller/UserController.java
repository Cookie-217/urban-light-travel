package com.urbantravel.controller;

import com.urbantravel.model.dto.AuthDto.UserInfo;
import com.urbantravel.model.entity.User;
import com.urbantravel.security.CurrentUserService;
import com.urbantravel.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final CurrentUserService currentUserService;
    private final UserService userService;

    public UserController(CurrentUserService currentUserService, UserService userService) {
        this.currentUserService = currentUserService;
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserInfo> me() {
        User u = currentUserService.requireUser();
        return ResponseEntity.ok(new UserInfo(u.getId(), u.getUsername(), u.getEmail(),
                u.getRole().name(), u.getPreferences(), u.getCreatedAt()));
    }

    @PutMapping("/me/preferences")
    public ResponseEntity<UserInfo> updatePreferences(@RequestBody String preferencesJson) {
        Long uid = currentUserService.requireUserId();
        User u = userService.updatePreferences(uid, preferencesJson);
        return ResponseEntity.ok(new UserInfo(u.getId(), u.getUsername(), u.getEmail(),
                u.getRole().name(), u.getPreferences(), u.getCreatedAt()));
    }
}
