package com.urbantravel.model.dto;

import java.util.List;

public class AiDto {

    public static class ChatTurn {
        public String role;   // user / assistant
        public String content;

        public ChatTurn() {}
        public ChatTurn(String role, String content) {
            this.role = role; this.content = content;
        }
    }

    public static class ChatRequest {
        public String message;
        public List<ChatTurn> history;
    }

    public static class ChatResponse {
        public String reply;
        public boolean usedLlm;
        public PlanDto.RoutePlan plan;

        public ChatResponse() {}
        public ChatResponse(String reply, boolean usedLlm, PlanDto.RoutePlan plan) {
            this.reply = reply; this.usedLlm = usedLlm; this.plan = plan;
        }
    }
}
