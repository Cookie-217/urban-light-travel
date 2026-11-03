package com.urbantravel.security;

import com.urbantravel.model.entity.User;
import com.urbantravel.repository.UserRepository;
import org.springframework.stereotype.Component;

@Component
public class CurrentUserService {

    private final SecurityUtils securityUtils;
    private final UserRepository userRepository;

    public CurrentUserService(SecurityUtils securityUtils, UserRepository userRepository) {
        this.securityUtils = securityUtils;
        this.userRepository = userRepository;
    }

    public Long requireUserId() {
        String username = securityUtils.currentUsername();
        if (username == null) throw new SecurityException("未登录");
        User u = userRepository.findByUsername(username)
                .orElseThrow(() -> new SecurityException("用户不存在"));
        return u.getId();
    }

    public User requireUser() {
        String username = securityUtils.currentUsername();
        if (username == null) throw new SecurityException("未登录");
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new SecurityException("用户不存在"));
    }
}
