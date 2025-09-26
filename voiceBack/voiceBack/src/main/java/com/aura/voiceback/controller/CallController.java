package com.aura.voiceback.controller;

import com.aura.voiceback.service.CallSessionManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/call")
public class CallController {

    @Autowired
    private CallSessionManager callSessionManager;

    /**
     * 1:1 통화 시작 요청
     * body: { "callerId": "user1", "calleeId": "user2" }
     */
    @PostMapping("/start")
    public ResponseEntity<?> startCall(@RequestBody Map<String, String> payload) {
        String callerId = payload.get("callerId");
        String calleeId = payload.get("calleeId");

        if (callerId == null || calleeId == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "callerId and calleeId required"));
        }

        String sessionId = callSessionManager.createSession(callerId, calleeId);

        return ResponseEntity.ok(Map.of(
                "sessionId", sessionId,
                "callerId", callerId,
                "calleeId", calleeId,
                "message", "Call session created"
        ));
    }

    /**
     * 통화 종료 요청
     * body: { "sessionId": "..." }
     */
    @PostMapping("/end")
    public ResponseEntity<?> endCall(@RequestBody Map<String, String> payload) {
        String sessionId = payload.get("sessionId");
        if (sessionId == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "sessionId required"));
        }

        callSessionManager.endSession(sessionId);

        return ResponseEntity.ok(Map.of(
                "sessionId", sessionId,
                "message", "Call session ended"
        ));
    }

    /**
     * 1️⃣ 통화방 생성
     * body: { "creatorId": "user1", "roomName": "Room A" }
     */
    @PostMapping("/room/create")
    public ResponseEntity<?> createRoom(@RequestBody Map<String, String> payload) {
        String creatorId = payload.get("creatorId");
        String roomName = payload.get("roomName");
        if (creatorId == null || roomName == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "creatorId and roomName required"));
        }

        String roomId = callSessionManager.createRoom(creatorId, roomName);

        return ResponseEntity.ok(Map.of(
                "id", roomId,          // ✅ 프론트와 맞춤
                "name", roomName,      // ✅ 프론트와 맞춤
                "creatorId", creatorId,
                "participants", 1,
                "message", "Room created"
        ));
    }

    @GetMapping("/room/list")
    public ResponseEntity<?> listRooms() {
        List<Map<String, Object>> rooms = new ArrayList<>();
        for (CallSessionManager.Room r : callSessionManager.getAllRooms()) {
            rooms.add(Map.of(
                    "id", r.getId(),                   // ✅ id
                    "name", r.getName(),               // ✅ name
                    "participants", r.getParticipants().size()
            ));
        }
        return ResponseEntity.ok(Map.of("rooms", rooms));
    }

    /**
     * 3️⃣ 통화방 참가
     * body: { "userId": "user2", "roomId": "..." }
     */
    @PostMapping("/room/join")
    public ResponseEntity<?> joinRoom(@RequestBody Map<String, String> payload) {
        String userId = payload.get("userId");
        String roomId = payload.get("roomId");

        if (userId == null || roomId == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "userId and roomId required"));
        }

        boolean joined = callSessionManager.joinRoom(userId, roomId);
        if (!joined) {
            return ResponseEntity.status(404).body(Map.of("error", "Room not found"));
        }

        CallSessionManager.Room room = callSessionManager.getRoom(roomId);

        return ResponseEntity.ok(Map.of(
                "roomId", room.getId(),
                "roomName", room.getName(),
                "participants", room.getParticipants().size(),
                "userId", userId,
                "message", "Joined room"
        ));
    }

    @PostMapping("/room/leave")
    public ResponseEntity<?> leaveRoom(@RequestBody Map<String, String> payload) {
        String userId = payload.get("userId");
        String roomId = payload.get("roomId");

        if (userId == null || roomId == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "userId and roomId required"));
        }

        boolean exists = callSessionManager.leaveRoom(userId, roomId);
        if (!exists) {
            return ResponseEntity.ok(Map.of(
                    "roomId", roomId,
                    "message", "Room deleted (no participants left)"
            ));
        }

        CallSessionManager.Room room = callSessionManager.getRoom(roomId);
        return ResponseEntity.ok(Map.of(
                "roomId", room.getId(),
                "roomName", room.getName(),
                "participants", room.getParticipants().size(),
                "userId", userId,
                "message", "Left room"
        ));
    }
}
