package com.urbantravel.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtils {

    /** 返回当前登录用户名，未登录返回 null */
    public String currentUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) {
            return null;
        }
        Object principal = auth.getPrincipal();
        if (principal instanceof User) {
            return ((User) principal).getUsername();
        }
        return auth.getName();
    }

    public boolean isAuthenticated() {
        return currentUsername() != null;
    }
}
