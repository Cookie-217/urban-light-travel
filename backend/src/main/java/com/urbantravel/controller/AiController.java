package com.urbantravel.controller;

import com.urbantravel.model.dto.AiDto.ChatRequest;
import com.urbantravel.model.dto.AiDto.ChatResponse;
import com.urbantravel.service.AiAgentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final AiAgentService aiAgentService;

    public AiController(AiAgentService aiAgentService) {
        this.aiAgentService = aiAgentService;
    }

    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest req) {
        return ResponseEntity.ok(aiAgentService.chat(req));
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> status() {
        Map<String, Object> m = new HashMap<>();
        m.put("llmEnabled", aiAgentService.isLlmEnabled());
        m.put("agent", "urban-travel-agent");
        m.put("version", "1.0.0");
        return ResponseEntity.ok(m);
    }
}
