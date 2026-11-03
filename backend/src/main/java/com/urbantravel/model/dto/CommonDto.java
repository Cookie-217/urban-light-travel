package com.urbantravel.model.dto;

public class CommonDto {

    public static class ApiResponse {
        public boolean success;
        public String message;
        public Object data;

        public ApiResponse() {}
        public ApiResponse(boolean success, String message, Object data) {
            this.success = success; this.message = message; this.data = data;
        }
        public static ApiResponse ok(Object data) { return new ApiResponse(true, "ok", data); }
        public static ApiResponse ok(String message, Object data) { return new ApiResponse(true, message, data); }
        public static ApiResponse fail(String message) { return new ApiResponse(false, message, null); }
    }

    public static class MessageResponse {
        public String message;
        public MessageResponse(String message) { this.message = message; }
    }
}
